import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { View } from 'react-native';
import {
  compose,
  lifecycle,
  withHandlers,
  withState,
} from 'recompact';
import { withNavigation } from 'react-navigation';
import { Modal, LoadingOverlay } from '../components/modal';
import ProfileRow from '../components/change-wallet/ProfileRow';
import ProfileDivider from '../components/change-wallet/ProfileDivider';
import ProfileOption from '../components/change-wallet/ProfileOption';
import { withDataInit, withIsWalletImporting, withAccountAddress } from '../hoc';
import { loadUsersInfo } from '../model/wallet';
import ProfileList from '../components/change-wallet/ProfileList';

const Container = styled.View`
  padding-top: 2px;
`;

const headerHeight = 68;
const profileRowHeight = 54;

const ChangeWalletModal = ({
  accountAddress,
  isCreatingWallet,
  navigation,
  onChangeWallet,
  onCloseEditProfileModal,
  onCloseModal,
  onPressBack,
  onPressCreateWallet,
  onPressImportSeedPhrase,
  onPressSection,
  profiles,
}) => {
  let currentProfile = false;
  if (profiles) {
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].address.toLowerCase() === accountAddress) {
        currentProfile = profiles[i];
      }
    }
  }
  const size = profiles ? profiles.length - 1 : 0;
  let listHeight = (profileRowHeight * 2) + (profileRowHeight * size);
  if (listHeight > 258) {
    listHeight = 258;
  }
  return (
    <View>
      {isCreatingWallet && (
        <LoadingOverlay title="Creating Wallet..." />
      )}
      <Modal
        fixedToTop
        height={headerHeight + listHeight}
        onCloseModal={onCloseModal}
        style={{ borderRadius: 18 }}
      >
        <Container>
          {currentProfile && <ProfileRow
            accountName={currentProfile.name}
            accountColor={currentProfile.color}
            accountAddress={accountAddress}
            isHeader
            onPress={() => navigation.goBack()}
            onEditWallet={() => navigation.navigate('ExpandedAssetScreen', {
              address: accountAddress,
              asset: [],
              isCurrentProfile: true,
              onCloseModal: () => onCloseEditProfileModal(true),
              profile: currentProfile,
              type: 'profile_creator',
            })}
          />}
          <ProfileDivider />
          <ProfileList
            accountAddress={accountAddress}
            allAssets={profiles}
            height={listHeight}
            onChangeWallet={onChangeWallet}
            onCloseEditProfileModal={onCloseEditProfileModal}
            onPressCreateWallet={onPressCreateWallet}
            onPressImportSeedPhrase={onPressImportSeedPhrase}
          />
        </Container>
      </Modal>
    </View>
  );
};

ChangeWalletModal.propTypes = {
  accountAddress: PropTypes.string,
  currentProfile: PropTypes.object,
  isCreatingWallet: PropTypes.bool,
  navigation: PropTypes.object,
  onChangeWallet: PropTypes.func,
  onCloseEditProfileModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressBack: PropTypes.func,
  onPressCreateWallet: PropTypes.func,
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
  withState('isCreatingWallet', 'setIsCreatingWallet', false),
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
    onPressCreateWallet: ({ createNewWallet, navigation, clearAccountData, setIsCreatingWallet }) => () => {
      navigation.navigate('ExpandedAssetScreen', {
        actionType: 'Create',
        address: undefined,
        asset: [],
        isCurrentProfile: false,
        isNewProfile: true,
        onCloseModal: (isCanceled) => {
          if (!isCanceled) {
            setIsCreatingWallet(true);
            setTimeout(async () => {
              await clearAccountData();
              await createNewWallet();
              navigation.goBack();
              navigation.navigate('WalletScreen');
            }, 20);
          }
        },
        profile: {},
        type: 'profile_creator',
      });
    },
    onPressImportSeedPhrase: ({ navigation, setSafeTimeout }) => () => {
      navigation.goBack();
      navigation.navigate('ImportSeedPhraseSheet');
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
      const profiles = this.props.navigation.getParam('profiles', []);
      this.props.setProfiles(profiles);
    },
  }),
)(ChangeWalletModal);
