import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { InteractionManager } from 'react-native';
import {
  compose,
  withHandlers,
} from 'recompact';
import { withNavigation } from 'react-navigation';
import { Modal } from '../components/modal';
import ProfileRow from '../components/change-wallet/ProfileRow';
import ProfileDivider from '../components/change-wallet/ProfileDivider';
import ProfileOption from '../components/change-wallet/ProfileOption';
import { withDataInit, withIsWalletImporting } from '../hoc';

const Container = styled.View`
  padding-top: 2px;
`;

const ChangeWalletModal = ({
  navigation,
  onChangeWallet,
  onCloseModal,
  onPressBack,
  onPressImportSeedPhrase,
  onPressSection,
}) => {
  return (
    <Modal height={290} onCloseModal={onCloseModal}>
      <Container>
        <ProfileRow accountName={'Bob'} accountAddress={''} isHeader onPress={() => onChangeWallet('')}/>
        <ProfileDivider />
        <ProfileRow accountName={'Something'} accountAddress={''} onPress={() => onChangeWallet('')}/>
        <ProfileRow accountName={'Someone'} accountAddress={''} onPress={() => onChangeWallet('')}/>
        <ProfileOption accountName={'Add another wallet'}/>
        <ProfileOption accountName={'Manage my wallets'}/>
      </Container>
    </Modal>
  );
};

ChangeWalletModal.propTypes = {
  navigation: PropTypes.object,
  onChangeWallet: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressBack: PropTypes.func,
  onPressImportSeedPhrase: PropTypes.func,
  onPressSection: PropTypes.func,
};

export default compose(
  withDataInit,
  withNavigation,
  withIsWalletImporting,
  withHandlers({
    onCloseModal: ({ navigation }) => () => navigation.goBack(),
    onPressImportSeedPhrase: ({ navigation, setSafeTimeout }) => () => {
      navigation.goBack();
      InteractionManager.runAfterInteractions(() => {
        navigation.navigate('ImportSeedPhraseSheet');
      });
    },
    onChangeWallet: ({ initializeWalletWithAddress, navigation, setIsWalletImporting }) => async (address) => {
      navigation.navigate('WalletScreen');
      setIsWalletImporting(true);
      await initializeWalletWithAddress(true, false, address);
      setIsWalletImporting(false);
    },
  }),
)(ChangeWalletModal);
