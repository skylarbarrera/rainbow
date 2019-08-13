import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { InteractionManager } from 'react-native';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
} from 'recompact';
import { withNavigation } from 'react-navigation';
import { Modal } from '../components/modal';
import ProfileRow from '../components/change-wallet/ProfileRow';
import ProfileDivider from '../components/change-wallet/ProfileDivider';
import ProfileOption from '../components/change-wallet/ProfileOption';
import { withDataInit, withIsWalletImporting } from '../hoc';
import { loadUsersInfo } from '../model/wallet';

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
  profiles,
}) => {
  let renderProfiles = null;
  if (profiles) {
    renderProfiles = profiles.map((profile) => (
      <ProfileRow key={profile.address} accountName={profile.name} accountAddress={profile.address} isHeader onPress={() => onChangeWallet(profile)}/>
    ));
  }
  const size = profiles ? profiles.length : 0;
  return (
    <Modal height={68 + (54 * 2) + (54 * size)} onCloseModal={onCloseModal}>
      <Container>
        <ProfileRow accountName={'Bob'} accountAddress={''} isHeader onPress={() => onChangeWallet('')}/>
        <ProfileDivider />
        {renderProfiles}
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
  profiles: PropTypes.array,
};

export default compose(
  withDataInit,
  withNavigation,
  withIsWalletImporting,
  withState('currentProfile', 'setCurrentProfile', undefined),
  withState('profiles', 'setProfiles', undefined),
  withHandlers({
    onChangeWallet: ({ initializeWalletWithProfile, navigation, setIsWalletImporting }) => async (profile) => {
      navigation.navigate('WalletScreen');
      setIsWalletImporting(true);
      await initializeWalletWithProfile(true, false, profile);
      setIsWalletImporting(false);
    },
    onCloseModal: ({ navigation }) => () => navigation.goBack(),
    onPressImportSeedPhrase: ({ navigation, setSafeTimeout }) => () => {
      navigation.goBack();
      InteractionManager.runAfterInteractions(() => {
        navigation.navigate('ImportSeedPhraseSheet');
      });
    },
    setProfiles: ({ setProfiles }) => (profiles) => {
      setProfiles(profiles);
    },
  }),
  lifecycle({
    componentDidMount(setProfiles) {
      loadUsersInfo()
        .then((response) => {
          this.props.setProfiles(response);
        });
    },
  }),
)(ChangeWalletModal);
