import { get } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import {
  convertAmountToNativeDisplay,
  multiply,
  updatePrecisionToDisplay,
} from '../helpers/utilities';
import { ethereumUtils } from '../utils';
import useAccountAssets from './useAccountAssets';

export default function useSwapDetails() {
  const [extraTradeDetails, setExtraTradeDetails] = useState({});
  const { allAssets } = useAccountAssets();

  const updateExtraTradeDetails = useCallback(
    ({
      inputCurrency,
      nativeCurrency,
      outputCurrency,
      tradeDetails,
      useV1,
    }) => {
      let inputExecutionRate = '';
      let inputNativePrice = '';
      let outputExecutionRate = '';
      let outputNativePrice = '';

      let inputPriceValue = null;

      if (inputCurrency) {
        inputPriceValue = get(inputCurrency, 'native.price.amount', null);

        inputExecutionRate = useV1
          ? get(tradeDetails, 'executionRate.rate', 0)
          : tradeDetails?.executionPrice?.toFixed();

        inputExecutionRate = updatePrecisionToDisplay(
          inputExecutionRate,
          inputPriceValue
        );

        inputNativePrice = inputPriceValue
          ? convertAmountToNativeDisplay(inputPriceValue, nativeCurrency)
          : '-';
      }

      if (outputCurrency) {
        const outputCurrencyInWallet = ethereumUtils.getAsset(
          allAssets,
          outputCurrency.address
        );

        let outputPriceValue = get(
          outputCurrencyInWallet,
          'native.price.amount',
          null
        );

        outputExecutionRate = useV1
          ? get(tradeDetails, 'executionRate.rateInverted', 0)
          : tradeDetails?.executionPrice?.invert()?.toFixed();

        // If the output curreny was not found in wallet and the input currency has a price
        // Calculate the output currency price based off of the input currency price
        if (!outputPriceValue && inputPriceValue) {
          outputPriceValue = multiply(inputPriceValue, outputExecutionRate);
        }

        outputExecutionRate = updatePrecisionToDisplay(
          outputExecutionRate,
          outputPriceValue
        );

        outputNativePrice = outputPriceValue
          ? convertAmountToNativeDisplay(outputPriceValue, nativeCurrency)
          : '-';
      }

      setExtraTradeDetails({
        inputExecutionRate,
        inputNativePrice,
        outputExecutionRate,
        outputNativePrice,
      });
    },
    [allAssets]
  );

  const areTradeDetailsValid = useMemo(() => {
    const {
      inputExecutionRate,
      inputNativePrice,
      outputExecutionRate,
      outputNativePrice,
    } = extraTradeDetails;

    return (
      inputExecutionRate &&
      inputNativePrice &&
      outputExecutionRate &&
      outputNativePrice
    );
  }, [extraTradeDetails]);

  return {
    areTradeDetailsValid: !!areTradeDetailsValid,
    extraTradeDetails,
    updateExtraTradeDetails,
  };
}
