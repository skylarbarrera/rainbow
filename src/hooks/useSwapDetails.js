import { get } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import {
  convertAmountToNativeDisplay,
  updatePrecisionToDisplay,
} from '../helpers/utilities';

export default function useSwapDetails() {
  const [extraTradeDetails, setExtraTradeDetails] = useState({});

  const updateExtraTradeDetails = useCallback(
    ({ inputCurrency, nativeCurrency, outputCurrency, tradeDetails }) => {
      let inputExecutionRate = '';
      let inputNativePrice = '';
      let outputExecutionRate = '';
      let outputNativePrice = '';

      if (inputCurrency) {
        const inputPriceValue = get(inputCurrency, 'native.price.amount', null);

        inputExecutionRate = updatePrecisionToDisplay(
          get(tradeDetails, 'executionRate.rate', 0),
          inputPriceValue
        );

        inputNativePrice = convertAmountToNativeDisplay(
          inputPriceValue,
          nativeCurrency
        );
      }

      if (outputCurrency) {
        const outputPriceValue = get(
          outputCurrency,
          'native.price.amount',
          null
        );

        outputExecutionRate = updatePrecisionToDisplay(
          get(tradeDetails, 'executionRate.rateInverted', 0),
          outputPriceValue
        );

        outputNativePrice = convertAmountToNativeDisplay(
          outputPriceValue,
          nativeCurrency
        );
      }

      setExtraTradeDetails({
        inputExecutionRate,
        inputNativePrice,
        outputExecutionRate,
        outputNativePrice,
      });
    },
    []
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
    areTradeDetailsValid,
    extraTradeDetails,
    updateExtraTradeDetails,
  };
}
