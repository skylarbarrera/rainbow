import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Share } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { buildUniqueTokenName } from '../../helpers/assets';
import { useAsset } from '../../hooks';
import Routes from '../../screens/Routes/routesNames';
import { colors } from '../../styles';
import { magicMemo } from '../../utils';
import Divider from '../Divider';
import Link from '../Link';
import { Column, ColumnWithDividers } from '../layout';
import { SlackSheet, SheetActionButton, SheetActionButtonRow } from '../sheet';
import { Text } from '../text';
import { UniqueTokenAttributes } from '../unique-token';
import ExpandedStateSection from './ExpandedStateSection';
import {
  UniqueTokenExpandedStateHeader,
  UniqueTokenExpandedStateImage,
} from './unique-token';

const UniqueTokenExpandedState = ({ asset }) => {
  const { navigate } = useNavigation();
  const selectedAsset = useAsset(asset);

  const handlePressSend = useCallback(
    () => navigate(Routes.SEND_SHEET, { asset: selectedAsset }),
    [navigate, selectedAsset]
  );

  const handlePressShare = useCallback(() => {
    Share.share({
      title: `Share ${buildUniqueTokenName(asset)} Info`,
      url: asset.permalink,
    });
  }, [asset]);


  // //headerHeight={50}
  return (
    <SlackSheet>
      <UniqueTokenExpandedStateHeader asset={asset} />
      <UniqueTokenExpandedStateImage asset={asset} />
      <SheetActionButtonRow>
        <SheetActionButton
          color={colors.dark}
          icon="share"
          label="Share"
          onPress={handlePressShare}
        />
        {asset.isSendable && (
          <SheetActionButton
            color={colors.paleBlue}
            icon="send"
            label="Send"
            onPress={handlePressSend}
          />
        )}
      </SheetActionButtonRow>
      <Divider />
      <ColumnWithDividers>
        {!!asset.description && (
          <ExpandedStateSection title="Bio">
            {asset.description}
          </ExpandedStateSection>
        )}
        {!!asset.traits.length && (
          <ExpandedStateSection paddingBottom={14} title="Attributes">
            <UniqueTokenAttributes {...asset} />
          </ExpandedStateSection>
        )}
        {!!asset.asset_contract.description && (
          <ExpandedStateSection title={`About ${asset.asset_contract.name}`}>
            <Column>
              <Text
                color={colors.alpha(colors.blueGreyDark, 0.5)}
                lineHeight={25}
                size="lmedium"
              >
                {asset.asset_contract.description}
              </Text>
              <Link url={asset.asset_contract.external_link} />
            </Column>
          </ExpandedStateSection>
        )}
      </ColumnWithDividers>
    </SlackSheet>
  );
};

UniqueTokenExpandedState.propTypes = {
  asset: PropTypes.object,
};

export default UniqueTokenExpandedState; //magicMemo(, 'asset');

