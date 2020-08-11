import { useRoute } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components';
import BackupIcon from '../../../assets/backupIcon.png';
import WalletBackupTypes from '../../../helpers/walletBackupTypes';
import { useWallets } from '../../../hooks';
import { useNavigation } from '../../../navigation/Navigation';
import { RainbowButton } from '../../buttons';
import { Column } from '../../layout';
import { SheetActionButton } from '../../sheet';
import { Text } from '../../text';
import Routes from '@rainbow-me/routes';
import { colors, fonts, padding } from '@rainbow-me/styles';

const BackupButton = styled(RainbowButton).attrs({
  type: 'small',
  width: 221,
})`
  margin-bottom: 19;
`;

const DescriptionText = styled(Text).attrs({
  align: 'center',
  color: colors.alpha(colors.blueGreyDark, 0.5),
  lineHeight: 'loosest',
  size: 'large',
})`
  margin-bottom: 42;
  padding-horizontal: 23;
`;

const Subtitle = styled(Text).attrs({
  align: 'center',
  color: colors.orangeLight,
  size: fonts.size.smedium,
  weight: fonts.weight.medium,
})`
  margin-top: -10;
`;

const Title = styled(Text).attrs({
  align: 'center',
  size: 'larger',
  weight: 'bold',
})`
  margin-bottom: 8;
  padding-horizontal: 11;
`;

const TopIcon = styled(FastImage).attrs({
  resizeMode: FastImage.resizeMode.contain,
  source: BackupIcon,
})`
  height: 74;
  width: 75;
`;

const NeedsBackupView = () => {
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute();
  const { wallets, selectedWallet } = useWallets();
  const walletId = params?.walletId || selectedWallet.id;

  useEffect(() => {
    if (wallets[walletId]?.backedUp) {
      setParams({ type: 'AlreadyBackedUpView' });
    }
  }, [setParams, walletId, wallets]);

  const onIcloudBackup = useCallback(() => {
    navigate(Routes.BACKUP_SHEET, {
      option: WalletBackupTypes.cloud,
      walletId,
    });
  }, [navigate, walletId]);

  const onManualBackup = useCallback(() => {
    navigate(Routes.BACKUP_SHEET, {
      option: WalletBackupTypes.manual,
      walletId,
    });
  }, [navigate, walletId]);

  return (
    <Fragment>
      <Subtitle>Not backed up</Subtitle>
      <Column align="center" css={padding(0, 19, 42)} flex={1} justify="center">
        <Column align="center">
          <TopIcon />
          <Title>Back up your wallet </Title>
          <DescriptionText>
            Don&apos;t risk your money! Back up your wallet so you can recover
            it if you lose this device.
          </DescriptionText>
        </Column>

        <Column align="center">
          {Platform.OS === 'ios' && (
            <BackupButton
              label="􀙶 Back up to iCloud"
              onPress={onIcloudBackup}
            />
          )}
          <SheetActionButton
            color={colors.white}
            label="🤓 Back up manually"
            onPress={onManualBackup}
            textColor={colors.alpha(colors.blueGreyDark, 0.8)}
          />
        </Column>
      </Column>
    </Fragment>
  );
};

export default NeedsBackupView;