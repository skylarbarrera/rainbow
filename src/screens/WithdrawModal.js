import React from 'react';
import ExchangeModalTypes from '../helpers/exchangeModalTypes';
import createWithdrawFromCompoundRap, {
  estimateWithdrawFromCompound,
} from '../raps/withdrawFromCompound';
import ExchangeModalWithData from './ExchangeModalWithData';

const WithdrawModal = props => {
  const cTokenBalance = props[0].navigation.getParam('cTokenBalance');
  const defaultInputAsset = props[0].navigation.getParam('defaultInputAsset');
  const underlyingPrice = props[0].navigation.getParam('underlyingPrice');
  const supplyBalanceUnderlying = props[0].navigation.getParam(
    'supplyBalanceUnderlying'
  );

  return (
    <ExchangeModalWithData
      createRap={createWithdrawFromCompoundRap}
      cTokenBalance={cTokenBalance}
      defaultInputAsset={defaultInputAsset}
      estimateRap={estimateWithdrawFromCompound}
      inputHeaderTitle={`Withdraw ${defaultInputAsset.symbol}`}
      showOutputField={false}
      type={ExchangeModalTypes.withdrawal}
      underlyingPrice={underlyingPrice}
      supplyBalanceUnderlying={supplyBalanceUnderlying}
      {...props}
    />
  );
};

export default WithdrawModal;
