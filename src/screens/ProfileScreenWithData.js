import {
  compose,
  withHandlers,
  withProps,
  withState,
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
import { loadUsersInfo } from '../model/wallet';

export default compose(
  setDisplayName('ProfileScreen'),
  withAccountAddress,
  withAccountSettings,
  withAccountTransactions,
  withBlurTransitionProps,
  withIsWalletEmpty,
  withRequests,
  withState('shouldUpdate', 'setShouldUpdate', true),
  withHandlers({
    onPressBackButton: ({ navigation }) => () => navigation.navigate('WalletScreen'),
    onPressProfileHeader: ({ navigation, setShouldUpdate }) => async () => {
      const profiles = await loadUsersInfo();
      navigation.navigate('ChangeWalletModal', {
        profiles,
        setIsLoading: (payload) => setShouldUpdate(payload),
      });
    },
    onPressSettings: ({ navigation }) => () => navigation.navigate('SettingsModal'),
  }),
  withProps(({ isWalletEmpty, transactionsCount }) => ({
    isEmpty: isWalletEmpty && !transactionsCount,
  })),
)(ProfileScreen);
