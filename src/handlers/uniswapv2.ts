import { ChainId, Percent, Token, Trade, TradeType, WETH } from '@uniswap/sdk2';
import { UNISWAP_V2_ROUTER_ADDRESS } from '../references';

// default allowed slippage, in bips
const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

function computeSlippageAdjustedAmounts(
  trade: Trade,
  allowedSlippage: number
): { [field in Field]?: TokenAmount } {
  console.log('allowed slippage', allowedSlippage);
  const pct = new Percent(allowedSlippage, '10000');
  const results = {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  };
  console.log('slippage adjusted amts', results);
  return results;
}

enum SwapType {
  EXACT_TOKENS_FOR_TOKENS,
  EXACT_TOKENS_FOR_ETH,
  EXACT_ETH_FOR_TOKENS,
  TOKENS_FOR_EXACT_TOKENS,
  TOKENS_FOR_EXACT_ETH,
  ETH_FOR_EXACT_TOKENS,
}

function getSwapType(
  tokens: { [field in Field]?: Token },
  isExactIn: boolean,
  chainId: number
): SwapType {
  if (isExactIn) {
    if (tokens[Field.INPUT]?.equals(WETH[chainId as ChainId])) {
      return SwapType.EXACT_ETH_FOR_TOKENS;
    } else if (tokens[Field.OUTPUT]?.equals(WETH[chainId as ChainId])) {
      return SwapType.EXACT_TOKENS_FOR_ETH;
    } else {
      return SwapType.EXACT_TOKENS_FOR_TOKENS;
    }
  } else {
    if (tokens[Field.INPUT]?.equals(WETH[chainId as ChainId])) {
      return SwapType.ETH_FOR_EXACT_TOKENS;
    } else if (tokens[Field.OUTPUT]?.equals(WETH[chainId as ChainId])) {
      return SwapType.TOKENS_FOR_EXACT_ETH;
    } else {
      return SwapType.TOKENS_FOR_EXACT_TOKENS;
    }
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
const getExecutionDetailsV2 = ({
  accountAddress,
  allowedSlippage = INITIAL_ALLOWED_SLIPPAGE, // in bips, optional
  chainId,
  deadline = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now, optional
  trade,
  providerOrSigner,
}) => {
  const recipient = accountAddress;

  if (!trade || !recipient) return null;

  // will always be defined
  const {
    [Field.INPUT]: slippageAdjustedInput,
    [Field.OUTPUT]: slippageAdjustedOutput,
  } = computeSlippageAdjustedAmounts(trade, allowedSlippage);

  if (!slippageAdjustedInput || !slippageAdjustedOutput) return null;

  if (!chainId || !providerOrSigner) {
    throw new Error('missing dependencies in onSwap callback');
  }

  const path = trade.route.path.map(t => t.address);

  const deadlineFromNow: number = Math.ceil(Date.now() / 1000) + deadline;

  const swapType = getSwapType(
    {
      [Field.INPUT]: trade.inputAmount.token,
      [Field.OUTPUT]: trade.outputAmount.token,
    },
    trade.tradeType === TradeType.EXACT_INPUT,
    chainId as ChainId
  );

  // let estimate: Function, method: Function,
  let methodNames: string[],
    args: (string | string[] | number)[],
    value: string = null;
  switch (swapType) {
    case SwapType.EXACT_TOKENS_FOR_TOKENS:
      methodNames = [
        'swapExactTokensForTokens',
        'swapExactTokensForTokensSupportingFeeOnTransferTokens',
      ];
      args = [
        slippageAdjustedInput.raw.toString(),
        slippageAdjustedOutput.raw.toString(),
        path,
        recipient,
        deadlineFromNow,
      ];
      break;
    case SwapType.TOKENS_FOR_EXACT_TOKENS:
      methodNames = ['swapTokensForExactTokens'];
      args = [
        slippageAdjustedOutput.raw.toString(),
        slippageAdjustedInput.raw.toString(),
        path,
        recipient,
        deadlineFromNow,
      ];
      break;
    case SwapType.EXACT_ETH_FOR_TOKENS:
      methodNames = [
        'swapExactETHForTokens',
        'swapExactETHForTokensSupportingFeeOnTransferTokens',
      ];
      args = [
        slippageAdjustedOutput.raw.toString(),
        path,
        recipient,
        deadlineFromNow,
      ];
      value = slippageAdjustedInput.raw.toString();
      break;
    case SwapType.TOKENS_FOR_EXACT_ETH:
      methodNames = ['swapTokensForExactETH'];
      args = [
        slippageAdjustedOutput.raw.toString(),
        slippageAdjustedInput.raw.toString(),
        path,
        recipient,
        deadlineFromNow,
      ];
      break;
    case SwapType.EXACT_TOKENS_FOR_ETH:
      methodNames = [
        'swapExactTokensForETH',
        'swapExactTokensForETHSupportingFeeOnTransferTokens',
      ];
      args = [
        slippageAdjustedInput.raw.toString(),
        slippageAdjustedOutput.raw.toString(),
        path,
        recipient,
        deadlineFromNow,
      ];
      break;
    case SwapType.ETH_FOR_EXACT_TOKENS:
      methodNames = ['swapETHForExactTokens'];
      args = [
        slippageAdjustedOutput.raw.toString(),
        path,
        recipient,
        deadlineFromNow,
      ];
      value = slippageAdjustedInput.raw.toString();
      break;
  }
  return {
    exchangeAddress: UNISWAP_V2_ROUTER_ADDRESS,
    hello: 'HI',
    methodArguments: args,
    methodName: methodNames[0], // TODO JIN
    value,
  };
};

export default getExecutionDetailsV2;
