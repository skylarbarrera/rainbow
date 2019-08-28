import {
  compose,
  withHandlers,
  withProps,
  withState,
  lifecycle,
} from 'recompact';
import { setDisplayName } from 'recompose';
import {
  withAccountAddress,
  withAccountSettings,
  withAccountTransactions,
  withBlurTransitionProps,
  withIsWalletEmpty,
  withRequests,
} from '../hoc';
import ProfileScreen from './ProfileScreen';
import { loadUsersInfo, saveCurrentUserInfo } from '../model/wallet';

export default compose(
  setDisplayName('ProfileScreen'),
  withAccountAddress,
  withAccountSettings,
  withAccountTransactions,
  withBlurTransitionProps,
  withIsWalletEmpty,
  withRequests,
  withState('profiles', 'setProfiles', undefined),
  withHandlers({
    onPressBackButton: ({ navigation }) => () => navigation.navigate('WalletScreen'),
    onPressProfileHeader: ({ navigation, profiles, setProfiles }) => () => navigation.navigate('ChangeWalletModal', { 
      onCloseModal: (newProfiles) => setProfiles(newProfiles),
      profiles,
    }),
    onPressSettings: ({ navigation }) => () => navigation.navigate('SettingsModal'),
  }),
  withProps(({ isWalletEmpty, transactionsCount }) => ({
    isEmpty: isWalletEmpty && !transactionsCount,
  })),
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
)(ProfileScreen);
