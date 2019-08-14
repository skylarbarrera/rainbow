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
import { loadUsersInfo, loadCurrentUserInfo } from '../model/wallet';

const Container = styled.View`
  padding-top: 2px;
`;

const ChangeWalletModal = ({
  currentProfile,
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
    renderProfiles = profiles.map((profile) => {
      if (currentProfile && profile.address !== currentProfile.address) {
        return <ProfileRow key={profile.address} accountName={profile.name} accountAddress={profile.address} isHeader onPress={() => onChangeWallet(profile)}/>;
      } 
      return null;
    });
  }
  const size = profiles ? profiles.length - 1 : 0;
  return (
    <Modal height={68 + (54 * 2) + (54 * size)} onCloseModal={onCloseModal}>
      <Container>
        { currentProfile && <ProfileRow accountName={currentProfile.name} accountAddress={currentProfile.address} isHeader onPress={() => navigation.navigate('WalletScreen')}/>}
        <ProfileDivider />
        {renderProfiles}
        <ProfileOption label={'Add another wallet'} onPress={() => onPressImportSeedPhrase()}/>
        <ProfileOption label={'Manage my wallets'}/>
      </Container>
    </Modal>
  );
};

ChangeWalletModal.propTypes = {
  currentProfile: PropTypes.object,
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
    setCurrentProfile: ({ setCurrentProfile }) => (currentProfile) => {
      setCurrentProfile(currentProfile);
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
      loadCurrentUserInfo()
        .then((response) => {
          this.props.setCurrentProfile(response);
        });
    },
  }),
)(ChangeWalletModal);
