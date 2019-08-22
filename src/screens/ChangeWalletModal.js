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
import { settingsUpdateAccountName } from '../redux/settings';

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
              color: 2,
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
  const size = profiles ? profiles.length - 1 : 0;
  return (
    <Modal fixedToTop height={headerHeight + (profileRowHeight * 2) + (profileRowHeight * size)} onCloseModal={onCloseModal}>
      <Container>
        { currentProfile && (
          <ProfileRow
            accountName={currentProfile.name}
            accountAddress={accountAddress}
            isHeader
            onPress={() => navigation.navigate('WalletScreen')}
            onLongPress={() => navigation.navigate('ExpandedAssetScreen', {
              address: accountAddress,
              asset: [],
              color: 2,
              onCloseModal: () => onCloseEditProfileModal(),
              profile: currentProfile,
              type: 'profile_creator',
            })}
          />)}
        <ProfileDivider />
        {renderProfiles}
        <ProfileOption icon={'plus'} label={'Add another wallet'} onPress={() => onPressImportSeedPhrase()}/>
        <ProfileOption icon={'gear'} label={'Manage my wallets'} onPress={() => navigation.navigate('ExpandedAssetScreen', {
          address: 'asdasdasd',
          asset: [],
          color: 2,
          contact: {},
          onCloseModal: () => {},
          type: 'profile_creator',
        })}
        />
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
      console.log(newProfiles);
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
