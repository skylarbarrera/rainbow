import React, { useCallback } from 'react';
import { Image } from 'react-native';
import { useAccountProfile, useRequests } from '../../hooks';
import { useNavigation } from '../../navigation/Navigation';
import { NumberBadge } from '../badge';
import { ContactAvatar } from '../contacts';
import { Centered } from '../layout';
import HeaderButton from './HeaderButton';
import Routes from '@rainbow-me/routes';
import { colors } from '@rainbow-me/styles';

export default function ProfileHeaderButton() {
  const { navigate } = useNavigation();
  const { pendingRequestCount } = useRequests();
  const { accountSymbol, accountColor, accountImage } = useAccountProfile();

  const onPress = useCallback(() => navigate(Routes.PROFILE_SCREEN), [
    navigate,
  ]);

  const onLongPress = useCallback(() => navigate(Routes.CHANGE_WALLET_SHEET), [
    navigate,
  ]);

  return (
    <HeaderButton
      onLongPress={onLongPress}
      onPress={onPress}
      testID="goToProfile"
      transformOrigin="left"
    >
      <Centered>
        {accountImage ? (
          <Image
            source={accountImage}
            style={{ borderRadius: 17, height: 34, width: 34 }}
          />
        ) : (
          <ContactAvatar
            color={isNaN(accountColor) ? colors.skeleton : accountColor}
            size="small"
            value={accountSymbol}
          />
        )}
        <NumberBadge
          isVisible={pendingRequestCount > 0}
          value={pendingRequestCount}
        />
      </Centered>
    </HeaderButton>
  );
}
