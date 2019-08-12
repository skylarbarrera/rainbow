import PropTypes from 'prop-types';
import React from 'react';
import { InteractionManager } from 'react-native';
import {
  compose,
  withHandlers,
} from 'recompact';
import { Modal } from '../components/modal';
import ProfileRow from '../components/change-wallet/ProfileRow';

const ChangeWalletModal = ({
  navigation,
  onCloseModal,
  onPressBack,
  onPressImportSeedPhrase,
  onPressSection,
}) => {
  return (
    <Modal minHeight={300} onCloseModal={onCloseModal}>
      <ProfileRow accountName={'Mike Demarais'} accountAddress={'0xc4de2c0112312141124d32a'}/>
    </Modal>
  );
};

ChangeWalletModal.propTypes = {
  navigation: PropTypes.object,
  onCloseModal: PropTypes.func,
  onPressBack: PropTypes.func,
  onPressImportSeedPhrase: PropTypes.func,
  onPressSection: PropTypes.func,
};

export default compose(
  withHandlers({
    onCloseModal: ({ navigation }) => () => navigation.goBack(),
    onPressImportSeedPhrase: ({ navigation, setSafeTimeout }) => () => {
      navigation.goBack();
      InteractionManager.runAfterInteractions(() => {
        navigation.navigate('ImportSeedPhraseSheet');
      });
    },
  }),
)(ChangeWalletModal);
