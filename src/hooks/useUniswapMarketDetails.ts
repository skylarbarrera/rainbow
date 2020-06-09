import { Trade } from '@uniswap/sdk2';
import { get, isNil } from 'lodash';
import { useCallback } from 'react';
import {
  calculateTradeDetails,
  calculateTradeDetailsV2,
} from '../handlers/uniswap';
import {
  convertAmountFromNativeValue,
  convertNumberToString,
  convertRawAmountToDecimalFormat,
  greaterThan,
  greaterThanOrEqualTo,
  isZero,
  updatePrecisionToDisplay,
} from '../helpers/utilities';
import { logger } from '../utils';
import useAccountSettings from './useAccountSettings';
import useUniswapCurrencyReserves from './useUniswapCurrencyReserves';
import useUniswapMarketPrice from './useUniswapMarketPrice';
import useUniswapPairs from './useUniswapPairs';

const DEFAULT_NATIVE_INPUT_AMOUNT = 50;

function updateInputsUniswap({
  calculateInputGivenOutputChange,
  calculateOutputGivenInputChange,
  inputAmount,
  inputAsExactAmount,
  inputCurrency,
  inputFieldRef,
  maxInputBalance,
  outputAmount,
  outputCurrency,
  outputFieldRef,
  setIsSufficientBalance,
  setSlippage,
  tradeDetailsV1,
  tradeDetailsV2,
  updateInputAmount,
  updateOutputAmount,
}) {
  const isMissingAmounts = !inputAmount && !outputAmount;
  if (isMissingAmounts) return;

  const { decimals: inputDecimals } = inputCurrency;
  const { decimals: outputDecimals } = outputCurrency;

  // TODO JIN - fix slippage
  // const slippageV2 = tradeDetailsV2?.slippage?.toFixed(2).toString();

  // update slippage
  const slippage = convertNumberToString(
    get(tradeDetailsV1, 'executionRateSlippage', 0)
  );
  setSlippage(slippage);

  const newIsSufficientBalance =
    !inputAmount || greaterThanOrEqualTo(maxInputBalance, inputAmount);

  setIsSufficientBalance(newIsSufficientBalance);

  const isInputEmpty = !inputAmount;
  const isOutputEmpty = !outputAmount;

  const isInputZero = Number(inputAmount) === 0;
  const isOutputZero = Number(outputAmount) === 0;

  // update output amount given input amount changes
  if (inputAsExactAmount) {
    calculateOutputGivenInputChange({
      inputAsExactAmount,
      inputCurrency,
      isInputEmpty,
      isInputZero,
      outputCurrency,
      outputDecimals,
      outputFieldRef,
      tradeDetailsV1,
      tradeDetailsV2,
      updateOutputAmount,
    });
  }

  // update input amount given output amount changes
  if (
    !inputAsExactAmount &&
    inputFieldRef &&
    inputFieldRef.current &&
    !inputFieldRef.current.isFocused()
  ) {
    calculateInputGivenOutputChange({
      inputAsExactAmount,
      inputCurrency,
      inputDecimals,
      isOutputEmpty,
      isOutputZero,
      maxInputBalance,
      setIsSufficientBalance,
      tradeDetailsV1,
      tradeDetailsV2,
      updateInputAmount,
    });
  }
}

export default function useUniswapMarketDetails() {
  const { chainId } = useAccountSettings();
  const { getMarketPrice } = useUniswapMarketPrice();
  const { allPairs, inputToken, outputToken } = useUniswapPairs();

  const { inputReserve, outputReserve } = useUniswapCurrencyReserves();

  const updateTradeDetails = useCallback(
    ({
      inputAmount,
      inputAsExactAmount,
      inputCurrency,
      outputAmount,
      outputCurrency,
    }) => {
      let updatedInputAmount = inputAmount;
      let updatedInputAsExactAmount = inputAsExactAmount;
      const isMissingAmounts = !inputAmount && !outputAmount;

      if (isMissingAmounts) {
        const inputNativePrice = getMarketPrice(inputCurrency, outputCurrency);
        updatedInputAmount = convertAmountFromNativeValue(
          DEFAULT_NATIVE_INPUT_AMOUNT,
          inputNativePrice,
          inputCurrency.decimals
        );
        updatedInputAsExactAmount = true;
      }

      const tradeDetailsV2 = calculateTradeDetailsV2(
        inputAmount,
        outputAmount,
        inputToken,
        outputToken,
        allPairs,
        updatedInputAsExactAmount
      );

      const tradeDetailsV1 = calculateTradeDetails(
        chainId,
        updatedInputAmount,
        inputCurrency,
        inputReserve,
        outputAmount,
        outputCurrency,
        outputReserve,
        updatedInputAsExactAmount
      );
      return {
        v1: tradeDetailsV1,
        v2: tradeDetailsV2,
      };
    },
    [
      chainId,
      getMarketPrice,
      inputReserve,
      inputToken,
      outputReserve,
      outputToken,
      allPairs,
    ]
  );

  const calculateInputGivenOutputChange = useCallback(
    ({
      inputAsExactAmount,
      inputCurrency,
      inputDecimals,
      isOutputEmpty,
      isOutputZero,
      maxInputBalance,
      setIsSufficientBalance,
      tradeDetailsV1,
      tradeDetailsV2,
      updateInputAmount,
    }) => {
      if (isOutputEmpty || isOutputZero) {
        updateInputAmount();
        setIsSufficientBalance(true);
      } else {
        const updatedInputAmountV1 = tradeDetailsV1?.inputAmount?.amount;
        const rawUpdatedInputAmountV1 = convertRawAmountToDecimalFormat(
          updatedInputAmountV1,
          inputDecimals
        );
        const rawUpdatedInputAmountV2 = tradeDetailsV2?.inputAmount?.toExact();

        // SMALLER input value is the better option
        const isV2BetterThanV1 = greaterThanOrEqualTo(
          rawUpdatedInputAmountV1,
          rawUpdatedInputAmountV2
        );

        const rawUpdatedInputAmount = isV2BetterThanV1
          ? rawUpdatedInputAmountV2
          : rawUpdatedInputAmountV1;

        const updatedInputAmountDisplay = updatePrecisionToDisplay(
          rawUpdatedInputAmount,
          get(inputCurrency, 'price.value'),
          true
        );
        updateInputAmount(
          rawUpdatedInputAmount,
          updatedInputAmountDisplay,
          inputAsExactAmount
        );

        const isSufficientAmountToTrade = greaterThanOrEqualTo(
          maxInputBalance,
          rawUpdatedInputAmount
        );
        setIsSufficientBalance(isSufficientAmountToTrade);
      }
    },
    []
  );

  const calculateOutputGivenInputChange = useCallback(
    ({
      inputAsExactAmount,
      inputCurrency,
      isInputEmpty,
      isInputZero,
      outputCurrency,
      outputDecimals,
      outputFieldRef,
      tradeDetailsV1,
      tradeDetailsV2,
      updateOutputAmount,
    }) => {
      logger.log('calculate OUTPUT given INPUT change');
      if (
        (isInputEmpty || isInputZero) &&
        outputFieldRef &&
        outputFieldRef.current &&
        !outputFieldRef.current.isFocused()
      ) {
        updateOutputAmount(null, null, true);
      } else {
        const updatedOutputAmountV1 = tradeDetailsV1?.outputAmount?.amount;
        const rawUpdatedOutputAmountV1 = convertRawAmountToDecimalFormat(
          updatedOutputAmountV1,
          outputDecimals
        );
        const rawUpdatedOutputAmountV2 = tradeDetailsV2?.outputAmount?.toExact();

        // LARGER output value is the better option
        const isV1BetterThanV2 = greaterThan(
          rawUpdatedOutputAmountV1,
          rawUpdatedOutputAmountV2
        );

        const rawUpdatedOutputAmount = isV1BetterThanV2
          ? rawUpdatedOutputAmountV1
          : rawUpdatedOutputAmountV2;

        if (!isZero(rawUpdatedOutputAmount)) {
          let outputNativePrice = get(outputCurrency, 'price.value', null);
          if (isNil(outputNativePrice)) {
            // TODO JIN - may need to change get market price
            outputNativePrice = getMarketPrice(
              inputCurrency,
              outputCurrency,
              false
            );
          }
          const updatedOutputAmountDisplay = updatePrecisionToDisplay(
            rawUpdatedOutputAmount,
            outputNativePrice
          );

          updateOutputAmount(
            rawUpdatedOutputAmount,
            updatedOutputAmountDisplay,
            inputAsExactAmount
          );
        }
      }
    },
    [getMarketPrice]
  );

  const getMarketDetails = useCallback(
    ({
      inputAmount,
      inputAsExactAmount,
      inputCurrency,
      inputFieldRef,
      maxInputBalance,
      // nativeCurrency,
      outputAmount,
      outputCurrency,
      outputFieldRef,
      setIsSufficientBalance,
      setSlippage,
      // updateExtraTradeDetails,
      updateInputAmount,
      updateOutputAmount,
    }) => {
      const isMissingCurrency = !inputCurrency || !outputCurrency;
      const isMissingReserves =
        (get(inputCurrency, 'address') !== 'eth' && !inputReserve) ||
        (get(outputCurrency, 'address') !== 'eth' && !outputReserve);
      if (isMissingCurrency || isMissingReserves) return;

      try {
        const {
          v1: tradeDetailsV1,
          v2: tradeDetailsV2,
        }: { v1: any; v2: Trade | null } = updateTradeDetails({
          inputAmount,
          inputAsExactAmount,
          inputCurrency,
          outputAmount,
          outputCurrency,
        });

        updateInputsUniswap({
          calculateInputGivenOutputChange,
          calculateOutputGivenInputChange,
          inputAmount,
          inputAsExactAmount,
          inputCurrency,
          inputFieldRef,
          maxInputBalance,
          outputAmount,
          outputCurrency,
          outputFieldRef,
          setIsSufficientBalance,
          setSlippage,
          tradeDetailsV1,
          tradeDetailsV2,
          updateInputAmount,
          updateOutputAmount,
        });

        // TODO JIN v1 - need to fix and enable
        /*
        updateExtraTradeDetails({
          inputCurrency,
          nativeCurrency,
          outputCurrency,
          tradeDetails: tradeDetailsV1,
        });
       */
      } catch (error) {
        logger.log('error getting market details', error);
      }
    },
    [
      calculateInputGivenOutputChange,
      calculateOutputGivenInputChange,
      inputReserve,
      outputReserve,
      updateTradeDetails,
    ]
  );

  return {
    getMarketDetails,
  };
}
