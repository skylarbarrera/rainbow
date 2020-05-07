import React from 'react';
import AddCashSheet from '../AddCashSheet';
import DepositModal from '../DepositModal';
import ExpandedAssetSheet from '../ExpandedAssetSheet';
import ImportSeedPhraseSheetWithData from '../ImportSeedPhraseSheetWithData';
import SendSheet from '../SendSheet';
import WithdrawModal from '../WithdrawModal';

export const appearListener = { current: null };
export const setListener = listener => (appearListener.current = listener);

export function AddCashSheetWrapper(...props) {
  return <AddCashSheet {...props} setAppearListener={setListener} />;
}

export function ExpandedAssetSheetWrapper(...props) {
  return <ExpandedAssetSheet {...props} setAppearListener={setListener} />;
}

export function ImportSeedPhraseSheetWrapper(...props) {
  return (
    <ImportSeedPhraseSheetWithData {...props} setAppearListener={setListener} />
  );
}

export function SendSheetWrapper(...props) {
  return <SendSheet {...props} setAppearListener={setListener} />;
}

export function WithdrawModalWrapper(...props) {
  return <WithdrawModal {...props} setAppearListener={setListener} />;
}

export function DepositModalWrapper(...props) {
  return <DepositModal {...props} setAppearListener={setListener} />;
}
