import PropTypes from 'prop-types';
import React from 'react';
import { ActivityList } from '../components/activity-list';
import AddFundsInterstitial from '../components/AddFundsInterstitial';
import BlurOverlay from '../components/BlurOverlay';
import { BackButton, Header, HeaderButton } from '../components/header';
import { FlexItem, Page } from '../components/layout';
import { Icon } from '../components/icons';
import { ProfileMasthead } from '../components/profile';
import { colors, position } from '../styles';
import HeaderProfileInfo from '../components/header/HeaderProfileInfo';

const ProfileScreen = ({
  accountAddress,
  accountName,
  blurIntensity,
  isEmpty,
  nativeCurrency,
  navigation,
  onPressBackButton,
  onPressProfileHeader,
  onPressSettings,
  requests,
  transactions,
  transactionsCount,
}) => (
  <Page component={FlexItem} style={position.sizeAsObject('100%')}>
    <Header justify="space-between">
      <HeaderButton onPress={onPressSettings}>
        <Icon name="gear" />
      </HeaderButton>
      <HeaderProfileInfo
        displayName={accountName}
        onPress={onPressProfileHeader}
        accountAddress={accountAddress}
      >
        <Icon name="gear" />
      </HeaderProfileInfo>
      <BackButton
        direction="right"
        onPress={onPressBackButton}
      />
    </Header>
    <ActivityList
      accountAddress={accountAddress}
      header={(
        <ProfileMasthead
          accountAddress={accountAddress}
          navigation={navigation}
          showBottomDivider={!isEmpty}
          displayName={accountName}
        />
      )}
      accountName={accountName}
      isEmpty={isEmpty}
      nativeCurrency={nativeCurrency}
      requests={requests}
      transactions={transactions}
      transactionsCount={transactionsCount}
    />
    {isEmpty && <AddFundsInterstitial />}
  </Page>
);

ProfileScreen.propTypes = {
  accountAddress: PropTypes.string,
  accountName: PropTypes.string,
  blurIntensity: PropTypes.object,
  isEmpty: PropTypes.bool,
  nativeCurrency: PropTypes.string,
  navigation: PropTypes.object,
  onPressBackButton: PropTypes.func,
  onPressProfileHeader: PropTypes.func,
  onPressSettings: PropTypes.func,
  requests: PropTypes.array,
  transactions: PropTypes.array,
  transactionsCount: PropTypes.number,
};

export default ProfileScreen;
