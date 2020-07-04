import { get } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import {
  InteractionManager,
  Linking,
  NativeModules,
  ScrollView,
  View,
} from 'react-native';
import { isEmulatorSync } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as StoreReview from 'react-native-store-review';
import styled from 'styled-components/primitives';
import BackupIcon from '../../assets/settingsBackup.png';
import CurrencyIcon from '../../assets/settingsCurrency.png';
import LanguageIcon from '../../assets/settingsLanguage.png';
import NetworkIcon from '../../assets/settingsNetwork.png';
import {
  getAppStoreReviewCount,
  saveAppStoreReviewCount,
} from '../../handlers/localstorage/globalSettings';
import networkInfo from '../../helpers/networkInfo';
import walletTypes from '../../helpers/walletTypes';
import {
  useAccountSettings,
  useDimensions,
  useSendFeedback,
  useWallets,
} from '../../hooks';
import { supportedLanguages } from '../../languages';
import AppVersionStamp from '../AppVersionStamp';
import { Icon } from '../icons';
import { Column, ColumnWithDividers } from '../layout';
import {
  ListFooter,
  ListItem,
  ListItemArrowGroup,
  ListItemDivider,
} from '../list';
import { Emoji, Text } from '../text';
import { colors, position } from '@rainbow-me/styles';

const { RainbowRequestReview } = NativeModules;

const SettingsExternalURLs = {
  review:
    'itms-apps://itunes.apple.com/us/app/appName/id1457119021?mt=8&action=write-review',
  twitterDeepLink: 'twitter://user?screen_name=rainbowdotme',
  twitterWebUrl: 'https://twitter.com/rainbowdotme',
};

// ⚠️ Beware: magic numbers lol
const SettingIcon = styled(FastImage)`
  ${position.size(60)};
  margin-left: -16;
  margin-right: -11;
  margin-top: 8;
`;

let versionPressHandle = null;
let versionNumberOfTaps = 0;

const IconWrapper = styled(View)`
  height: 21;
  right: 7;
  top: -1;
  width: 22;
`;

const WarningIconText = styled(Text).attrs({
  color: colors.orangeLight,
  size: 22,
})`
  box-shadow: 0px 4px 12px rgba(254, 190, 68, 0.4);
`;

const WarningIcon = () => (
  <IconWrapper>
    <WarningIconText>􀇿</WarningIconText>
  </IconWrapper>
);
const CheckmarkIcon = () => (
  <IconWrapper>
    <Icon color={colors.green} name="checkmarkCircled" size={22} />
  </IconWrapper>
);

const checkAllWallets = wallets => {
  if (!wallets) return false;
  let areBackedUp = true;
  let canBeBackedUp = false;
  Object.keys(wallets).forEach(key => {
    if (!wallets[key].backedUp && wallets[key].type !== walletTypes.readOnly) {
      areBackedUp = false;
    }
    if (!wallets[key].type !== walletTypes.readOnly) {
      canBeBackedUp = true;
    }
  });
  return { areBackedUp, canBeBackedUp };
};

const SettingsSection = ({
  onCloseModal,
  onPressBackup,
  onPressCurrency,
  onPressHiddenFeature,
  onPressIcloudBackup,
  onPressLanguage,
  onPressNetwork,
  onPressDev,
  onPressShowSecret,
}) => {
  const { wallets } = useWallets();
  const { language, nativeCurrency, network } = useAccountSettings();
  const { isTallPhone } = useDimensions();

  const onSendFeedback = useSendFeedback();

  const handleVersionPress = useCallback(() => {
    versionPressHandle && clearTimeout(versionPressHandle);
    versionNumberOfTaps++;

    if (versionNumberOfTaps === 10) {
      onPressHiddenFeature();
    }

    versionPressHandle = setTimeout(() => {
      versionNumberOfTaps = 0;
    }, 3000);
  }, [onPressHiddenFeature]);

  const onPressReview = useCallback(async () => {
    if (RainbowRequestReview) {
      onCloseModal();
      RainbowRequestReview.requestReview(handled => {
        if (!handled) {
          Linking.openURL(SettingsExternalURLs.review);
        }
      });
    } else {
      const maxRequestCount = 2;
      const count = await getAppStoreReviewCount();
      const shouldDeeplinkToAppStore =
        count >= maxRequestCount || !StoreReview.isAvailable;

      if (shouldDeeplinkToAppStore && !isEmulatorSync()) {
        Linking.openURL(SettingsExternalURLs.review);
      } else {
        onCloseModal();
        InteractionManager.runAfterInteractions(StoreReview.requestReview);
      }

      return saveAppStoreReviewCount(count + 1);
    }
  }, [onCloseModal]);

  const onPressTwitter = useCallback(async () => {
    Linking.canOpenURL(SettingsExternalURLs.twitterDeepLink).then(supported =>
      supported
        ? Linking.openURL(SettingsExternalURLs.twitterDeepLink)
        : Linking.openURL(SettingsExternalURLs.twitterWebUrl)
    );
  }, []);

  const { areBackedUp, canBeBackedUp } = useMemo(
    () => checkAllWallets(wallets),
    [wallets]
  );

  return (
    <ScrollView
      contentContainerStyle={position.sizeAsObject('100%')}
      scrollEnabled={!isTallPhone}
      scrollEventThrottle={32}
      style={position.coverAsObject}
    >
      <ColumnWithDividers dividerRenderer={ListItemDivider} marginTop={8}>
        {canBeBackedUp && (
          <ListItem
            icon={<SettingIcon source={BackupIcon} />}
            label="Backup"
            onPress={onPressBackup}
            onPressIcloudBackup={onPressIcloudBackup}
            onPressShowSecret={onPressShowSecret}
          >
            <ListItemArrowGroup>
              {areBackedUp ? <CheckmarkIcon /> : <WarningIcon />}
            </ListItemArrowGroup>
          </ListItem>
        )}
        <ListItem
          icon={<SettingIcon source={NetworkIcon} />}
          label="Network"
          onPress={onPressNetwork}
        >
          <ListItemArrowGroup>
            {get(networkInfo, `[${network}].name`)}
          </ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<SettingIcon source={CurrencyIcon} />}
          label="Currency"
          onPress={onPressCurrency}
        >
          <ListItemArrowGroup>{nativeCurrency || ''}</ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<SettingIcon source={LanguageIcon} />}
          label="Language"
          onPress={onPressLanguage}
        >
          <ListItemArrowGroup>
            {supportedLanguages[language] || ''}
          </ListItemArrowGroup>
        </ListItem>
      </ColumnWithDividers>
      <ListFooter />
      <ColumnWithDividers dividerRenderer={ListItemDivider} paddingBottom={10}>
        <ListItem
          icon={<Emoji name="rainbow" />}
          label="Follow Us on Twitter"
          onPress={onPressTwitter}
          value={SettingsExternalURLs.twitter}
        />
        <ListItem
          icon={<Emoji name="speech_balloon" />}
          label="Leave Feedback"
          onPress={onSendFeedback}
        />
        <ListItem
          icon={<Emoji name="heart" />}
          label="Review Rainbow"
          onPress={onPressReview}
        />
        {__DEV__ && (
          <ListItem
            icon={<Emoji name="octopus" />}
            label="Developer Settings"
            onPress={onPressDev}
            testID="dev-section-button"
          />
        )}
      </ColumnWithDividers>
      <Column align="center">
        <TouchableWithoutFeedback onPress={handleVersionPress}>
          <AppVersionStamp />
        </TouchableWithoutFeedback>
      </Column>
    </ScrollView>
  );
};

export default SettingsSection;
