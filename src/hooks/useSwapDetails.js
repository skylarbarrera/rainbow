import { get } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import {
  convertAmountToNativeDisplay,
  updatePrecisionToDisplay,
} from '../helpers/utilities';

export default function useSwapDetails() {
  const [extraTradeDetails, setExtraTradeDetails] = useState({});

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

      if (inputCurrency) {
        const inputPriceValue = get(inputCurrency, 'native.price.amount', null);

        inputExecutionRate = useV1
          ? get(tradeDetails, 'executionRate.rate', 0)
          : tradeDetails?.executionPrice?.toFixed();

        inputExecutionRate = updatePrecisionToDisplay(
          inputExecutionRate,
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

        outputExecutionRate = useV1
          ? get(tradeDetails, 'executionRate.rateInverted', 0)
          : tradeDetails?.executionPrice?.invert()?.toFixed();

        outputExecutionRate = updatePrecisionToDisplay(
          outputExecutionRate,
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
