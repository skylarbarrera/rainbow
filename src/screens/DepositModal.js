import React from 'react';
import ExchangeModalTypes from '../helpers/exchangeModalTypes';
import createSwapAndDepositCompoundRap, {
  estimateSwapAndDepositCompound,
} from '../raps/swapAndDepositCompound';
import ExchangeModalWithData from './ExchangeModalWithData';

const DepositModal = props => {
  const defaultInputAsset = props[0].navigation.getParam('defaultInputAsset');
  return (
    <ExchangeModalWithData
      createRap={createSwapAndDepositCompoundRap}
      estimateRap={estimateSwapAndDepositCompound}
      defaultInputAsset={defaultInputAsset}
      inputHeaderTitle="Deposit"
      showOutputField={false}
      type={ExchangeModalTypes.deposit}
      {...props}
    />
  );
};

export default DepositModal;
