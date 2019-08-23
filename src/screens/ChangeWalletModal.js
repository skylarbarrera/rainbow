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
import { withDataInit, withIsWalletImporting, withAccountAddress } from '../hoc';
import { loadUsersInfo, saveCurrentUserInfo } from '../model/wallet';

const Container = styled.View`
  padding-top: 2px;
`;

const headerHeight = 68;
const profileRowHeight = 54;

const ChangeWalletModal = ({
  accountAddress,
  navigation,
  onChangeWallet,
  onCloseEditProfileModal,
  onCloseModal,
  onPressBack,
  onPressImportSeedPhrase,
  onPressSection,
  profiles,
}) => {
  let renderProfiles = null;
  let renderCurrentProfile = null;
  let currentProfile;
  if (profiles) {
    renderProfiles = profiles.map((profile) => {
      if (profile.address.toLowerCase() !== accountAddress) {
        return (
          <ProfileRow
            key={profile.address}
            accountName={profile.name}
            accountAddress={profile.address}
            isHeader
            onPress={() => onChangeWallet(profile)}
            onLongPress={() => navigation.navigate('ExpandedAssetScreen', {
              address: profile.address,
              asset: [],
              isCurrentProfile: false,
              onCloseModal: () => onCloseEditProfileModal(),
              profile,
              type: 'profile_creator',
            })}
          />);
      }
      currentProfile = profile;
      return null;
    });
  }
  if (currentProfile) {
    renderCurrentProfile = <ProfileRow
      accountName={currentProfile.name}
      accountAddress={accountAddress}
      isHeader
      onPress={() => navigation.navigate('WalletScreen')}
      onLongPress={() => navigation.navigate('ExpandedAssetScreen', {
        address: accountAddress,
        asset: [],
        isCurrentProfile: true,
        onCloseModal: () => onCloseEditProfileModal(true),
        profile: currentProfile,
        type: 'profile_creator',
      })}
    />;
  }
  const size = profiles ? profiles.length - 1 : 0;
  return (
    <Modal fixedToTop height={headerHeight + (profileRowHeight * 2) + (profileRowHeight * size)} onCloseModal={onCloseModal}>
      <Container>
        {renderCurrentProfile}
        <ProfileDivider />
        {renderProfiles}
        <ProfileOption icon={'plus'} label={'Add another wallet'} onPress={() => onPressImportSeedPhrase()}/>
        <ProfileOption icon={'gear'} label={'Manage my wallets'}/>
      </Container>
    </Modal>
  );
};

ChangeWalletModal.propTypes = {
  accountAddress: PropTypes.string,
  currentProfile: PropTypes.object,
  navigation: PropTypes.object,
  onChangeWallet: PropTypes.func,
  onCloseEditProfileModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressBack: PropTypes.func,
  onPressImportSeedPhrase: PropTypes.func,
  onPressSection: PropTypes.func,
  profiles: PropTypes.array,
};

export default compose(
  withAccountAddress,
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
    onCloseEditProfileModal: ({ setProfiles }) => async () => {
      const newProfiles = await loadUsersInfo();
      setProfiles(newProfiles);
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
    componentDidMount() {
      loadUsersInfo()
        .then((response) => {
          if (response && response.length > 0) {
            this.props.setProfiles(response);
          } else {
            saveCurrentUserInfo();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }),
)(ChangeWalletModal);
