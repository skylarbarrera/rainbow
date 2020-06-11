import {
  getExecutionDetails,
  getTokenReserves,
  tradeEthForExactTokensWithData,
  tradeExactEthForTokensWithData,
  tradeExactTokensForEthWithData,
  tradeExactTokensForTokensWithData,
  tradeTokensForExactEthWithData,
  tradeTokensForExactTokensWithData,
} from '@uniswap/sdk';
import { ChainId, Pair, Token, TokenAmount, Trade } from '@uniswap/sdk2';
import { getUnixTime, sub } from 'date-fns';
import contractMap from 'eth-contract-metadata';
import { ethers } from 'ethers';
import {
  findKey,
  get,
  map,
  mapKeys,
  mapValues,
  toLower,
  zipObject,
} from 'lodash';
import { uniswap2Client, uniswapClient } from '../apollo/client';
import {
  UNISWAP2_ALL_PAIRS,
  UNISWAP2_ALL_TOKENS,
  UNISWAP_ALL_EXCHANGES_QUERY,
  UNISWAP_CHART_QUERY,
} from '../apollo/queries';
import ChartTypes from '../helpers/chartTypes';
import {
  convertAmountToRawAmount,
  convertNumberToString,
  convertRawAmountToDecimalFormat,
  divide,
  fromWei,
  greaterThan,
  isBigNumber,
  multiply,
} from '../helpers/utilities';
import { loadWallet } from '../model/wallet';
import {
  erc20ABI,
  ethUnits,
  uniswapTestnetAssets,
  uniswapV1ExchangeABI,
  uniswapV2RouterABI,
} from '../references';
import { logger } from '../utils';
import getExecutionDetailsV2 from './uniswapv2';
import { toHex, web3Provider } from './web3';

const DefaultMaxSlippageInBips = 200;
const SlippageBufferInBips = 100;

export const getTestnetUniswapPairs = network => {
  const pairs = get(uniswapTestnetAssets, network, {});
  const loweredPairs = mapKeys(pairs, (_, key) => toLower(key));
  return mapValues(loweredPairs, value => ({
    ...value,
  }));
};

const convertV1Args = methodArguments =>
  methodArguments.map(arg =>
    isBigNumber(arg) ? ethers.utils.bigNumberify(arg.toFixed()) : arg
  );

const convertV1Value = value => {
  const valueBigNumber = ethers.utils.bigNumberify(value.toString());
  return ethers.utils.hexlify(valueBigNumber);
};

export const getReserve = async tokenAddress =>
  !tokenAddress || tokenAddress === 'eth'
    ? Promise.resolve(null)
    : getTokenReserves(toLower(tokenAddress), web3Provider);

export const getPair = async (tokenA: Token, tokenB: Token) => {
  console.log('fetching pair', tokenA.address, tokenB.address);
  return await Pair.fetchData(tokenA, tokenB, web3Provider);
};

export const estimateSwapGasLimit = async ({
  accountAddress,
  chainId,
  tradeDetails,
  useV1,
}) => {
  try {
    const {
      exchange,
      methodName,
      updatedMethodArgs,
      value,
    } = getContractExecutionDetails({
      accountAddress,
      chainId,
      providerOrSigner: web3Provider,
      tradeDetails,
      useV1,
    });
    const params = { from: accountAddress, ...(value ? { value } : {}) };
    const gasLimit = await exchange['estimate'][methodName](
      ...updatedMethodArgs,
      params
    );
    return gasLimit ? gasLimit.toString() : ethUnits.basic_swap;
  } catch (error) {
    logger.log('Error estimating swap gas limit', error);
    return ethUnits.basic_swap;
  }
};

const getContractExecutionDetails = ({
  accountAddress,
  chainId,
  providerOrSigner,
  tradeDetails,
  useV1,
}) => {
  const slippage = useV1
    ? convertNumberToString(get(tradeDetails, 'executionRateSlippage', 0))
    : tradeDetails?.slippage?.toFixed(2).toString();

  const maxSlippage = Math.max(
    slippage + SlippageBufferInBips,
    DefaultMaxSlippageInBips
  );

  const executionDetails = useV1
    ? getExecutionDetails(tradeDetails, maxSlippage)
    : getExecutionDetailsV2({
        accountAddress,
        allowedSlippage: maxSlippage,
        chainId,
        providerOrSigner,
        trade: tradeDetails,
      });

  const {
    exchangeAddress,
    methodArguments,
    methodName,
    value: rawValue,
  } = executionDetails;

  const abi = useV1 ? uniswapV1ExchangeABI : uniswapV2RouterABI;
  const exchange = new ethers.Contract(exchangeAddress, abi, providerOrSigner);

  const updatedMethodArgs = useV1
    ? convertV1Args(methodArguments)
    : methodArguments;

  const value = useV1 ? convertV1Value(rawValue) : rawValue;

  return {
    exchange,
    methodName,
    updatedMethodArgs,
    value,
  };
};

export const executeSwap = async ({
  accountAddress,
  chainId,
  gasLimit,
  gasPrice,
  tradeDetails,
  useV1 = false,
  wallet = null,
}) => {
  const walletToUse = wallet || (await loadWallet());
  if (!walletToUse) return null;
  const {
    exchange,
    methodName,
    updatedMethodArgs,
    value,
  } = getContractExecutionDetails({
    accountAddress,
    chainId,
    providerOrSigner: walletToUse,
    tradeDetails,
    useV1,
  });
  const transactionParams = {
    gasLimit: gasLimit ? toHex(gasLimit) : undefined,
    gasPrice: gasPrice ? toHex(gasPrice) : undefined,
    ...(value ? { value } : {}),
  };
  return exchange[methodName](...updatedMethodArgs, transactionParams);
};

export const getLiquidityInfo = async (
  accountAddress,
  exchangeContracts,
  pairs
) => {
  const promises = map(exchangeContracts, async exchangeAddress => {
    try {
      const ethReserveCall = web3Provider.getBalance(exchangeAddress);
      // TODO JIN - liquidity pool, support V2
      const exchange = new ethers.Contract(
        exchangeAddress,
        uniswapV1ExchangeABI,
        web3Provider
      );
      const tokenAddressCall = exchange.tokenAddress();
      const balanceCall = exchange.balanceOf(accountAddress);
      const totalSupplyCall = exchange.totalSupply();

      const [
        ethReserve,
        tokenAddress,
        balance,
        totalSupply,
      ] = await Promise.all([
        ethReserveCall,
        tokenAddressCall,
        balanceCall,
        totalSupplyCall,
      ]);

      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20ABI,
        web3Provider
      );

      const token = get(pairs, `[${toLower(tokenAddress)}]`);

      let decimals = '';
      let name = '';
      let symbol = '';

      if (token) {
        name = token.name;
        symbol = token.symbol;
        decimals = token.decimals;
      } else {
        decimals = get(contractMap, `[${tokenAddress}].decimals`, '');
        if (!decimals) {
          try {
            decimals = await tokenContract.decimals().catch();
          } catch (error) {
            decimals = 18;
            logger.log(
              'error getting decimals for token: ',
              tokenAddress,
              ' Error = ',
              error
            );
          }
        }

        name = get(contractMap, `[${tokenAddress}].name`, '');
        if (!name) {
          try {
            name = await tokenContract.name().catch();
          } catch (error) {
            logger.log(
              'error getting name for token: ',
              tokenAddress,
              ' Error = ',
              error
            );
          }
        }

        symbol = get(contractMap, `[${tokenAddress}].symbol`, '');
        if (!symbol) {
          try {
            symbol = await tokenContract.symbol().catch();
          } catch (error) {
            logger.log(
              'error getting symbol for token: ',
              tokenAddress,
              ' Error = ',
              error
            );
          }
        }
      }

      const reserve = await tokenContract.balanceOf(exchangeAddress);

      const ethBalance = fromWei(
        divide(multiply(ethReserve, balance), totalSupply)
      );
      const tokenBalance = convertRawAmountToDecimalFormat(
        divide(multiply(reserve, balance), totalSupply),
        decimals
      );

      return {
        balance,
        ethBalance,
        ethReserve,
        token: {
          balance: tokenBalance,
          decimals,
          name,
          symbol,
        },
        tokenAddress,
        totalSupply,
        uniqueId: `uniswap_${tokenAddress}`,
      };
    } catch (error) {
      logger.log('error getting uniswap info', error);
      return {};
    }
  });

  const results = await Promise.all(promises);
  return zipObject(exchangeContracts, results);
};

export const getChart = async (exchangeAddress, timeframe) => {
  const now = new Date();
  const timeframeKey = findKey(ChartTypes, type => type === timeframe);
  let startTime = getUnixTime(
    sub(now, {
      ...(timeframe === ChartTypes.max
        ? { years: 2 }
        : { [`${timeframeKey}s`]: 1 }),
      seconds: 1, // -1 seconds because we filter on greater than in the query
    })
  );

  let data = [];
  try {
    let dataEnd = false;
    while (!dataEnd) {
      const chartData = await uniswapClient
        .query({
          fetchPolicy: 'cache-first',
          query: UNISWAP_CHART_QUERY,
          variables: {
            date: startTime,
            exchangeAddress,
          },
        })
        .then(({ data: { exchangeDayDatas } }) =>
          exchangeDayDatas.map(({ date, tokenPriceUSD }) => [
            date,
            parseFloat(tokenPriceUSD),
          ])
        );

      data = data.concat(chartData);

      if (chartData.length !== 100) {
        dataEnd = true;
      } else {
        startTime = chartData[chartData.length - 1][0];
      }
    }
  } catch (err) {
    logger.log('error: ', err);
  }

  return data;
};

export const getAllPairsAndTokensV2 = async () => {
  const tokens = (
    await uniswap2Client.query({
      query: UNISWAP2_ALL_TOKENS,
    })
  )?.data.tokens.reduce((acc, { id, name, symbol, decimals }) => {
    acc[id] = new Token(ChainId.MAINNET, id, Number(decimals), symbol, name);
    return acc;
  }, {});

  if (!tokens) {
    return null;
  }

  const pairs = (
    await uniswap2Client.query({
      query: UNISWAP2_ALL_PAIRS,
    })
  )?.data.pairs.reduce((acc, pair) => {
    const token0 = tokens[pair.token0.id];
    const token1 = tokens[pair.token1.id];

    const res0 = convertAmountToRawAmount(pair.reserve0, token0.decimals);
    const res1 = convertAmountToRawAmount(pair.reserve1, token1.decimals);

    const amount0 = new TokenAmount(token0, res0);
    const amount1 = new TokenAmount(token1, res1);

    acc[pair.id] = new Pair(amount0, amount1);
    return acc;
  }, {});

  if (!pairs) {
    return null;
  }
  return {
    pairs,
    tokens,
  };
};

export const getAllExchanges = async (tokenOverrides, excluded = []) => {
  const pageSize = 600;
  let allTokens = {};
  let data = [];
  try {
    let dataEnd = false;
    let skip = 0;
    while (!dataEnd) {
      let result = await uniswapClient.query({
        query: UNISWAP_ALL_EXCHANGES_QUERY,
        variables: {
          excluded,
          first: pageSize,
          skip: skip,
        },
      });
      data = data.concat(result.data.exchanges);
      skip = skip + pageSize;
      if (result.data.exchanges.length < pageSize) {
        dataEnd = true;
      }
    }
  } catch (err) {
    logger.log('error: ', err);
  }
  data.forEach(exchange => {
    const tokenAddress = toLower(exchange.tokenAddress);
    const hasLiquidity = greaterThan(exchange.ethBalance, 0);
    if (hasLiquidity) {
      const tokenExchangeInfo = {
        decimals: exchange.tokenDecimals,
        ethBalance: exchange.ethBalance,
        exchangeAddress: exchange.id,
        name: exchange.tokenName,
        symbol: exchange.tokenSymbol,
        ...tokenOverrides[tokenAddress],
      };
      allTokens[tokenAddress] = tokenExchangeInfo;
    }
  });
  return allTokens;
};

export const calculateTradeDetails = (
  chainId,
  inputAmount,
  inputCurrency,
  inputReserve,
  outputAmount,
  outputCurrency,
  outputReserve,
  inputAsExactAmount
) => {
  const { address: inputAddress, decimals: inputDecimals } = inputCurrency;
  const { address: outputAddress, decimals: outputDecimals } = outputCurrency;

  const isInputEth = inputAddress === 'eth';
  const isOutputEth = outputAddress === 'eth';

  const rawInputAmount = convertAmountToRawAmount(
    inputAmount || 0,
    inputDecimals
  );

  const rawOutputAmount = convertAmountToRawAmount(
    outputAmount || 0,
    outputDecimals
  );

  let tradeDetails = null;

  if (isInputEth && !isOutputEth) {
    tradeDetails = inputAsExactAmount
      ? tradeExactEthForTokensWithData(outputReserve, rawInputAmount, chainId)
      : tradeEthForExactTokensWithData(outputReserve, rawOutputAmount, chainId);
  } else if (!isInputEth && isOutputEth) {
    tradeDetails = inputAsExactAmount
      ? tradeExactTokensForEthWithData(inputReserve, rawInputAmount, chainId)
      : tradeTokensForExactEthWithData(inputReserve, rawOutputAmount, chainId);
  } else if (!isInputEth && !isOutputEth) {
    tradeDetails = inputAsExactAmount
      ? tradeExactTokensForTokensWithData(
          inputReserve,
          outputReserve,
          rawInputAmount,
          chainId
        )
      : tradeTokensForExactTokensWithData(
          inputReserve,
          outputReserve,
          rawOutputAmount,
          chainId
        );
  }
  return tradeDetails;
};

export const calculateTradeDetailsV2 = (
  inputAmount: number,
  outputAmount: number,
  inputToken: Token,
  outputToken: Token,
  pairs: Record<string, Pair>,
  exactInput: boolean
): Trade | null => {
  if (!inputToken || !outputToken) {
    return null;
  }
  if (exactInput) {
    const inputRawAmount = convertAmountToRawAmount(
      convertNumberToString(inputAmount || 0),
      inputToken.decimals
    );

    const amountIn = new TokenAmount(inputToken, inputRawAmount);
    return Trade.bestTradeExactIn(Object.values(pairs), amountIn, outputToken, {
      maxNumResults: 1,
    })[0];
  } else {
    const outputRawAmount = convertAmountToRawAmount(
      convertNumberToString(outputAmount || 0),
      outputToken.decimals
    );
    const amountOut = new TokenAmount(outputToken, outputRawAmount);
    return Trade.bestTradeExactOut(
      Object.values(pairs),
      inputToken,
      amountOut,
      {
        maxNumResults: 1,
      }
    )[0];
  }
};
