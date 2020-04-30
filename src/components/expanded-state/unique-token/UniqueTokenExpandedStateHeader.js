import lang from 'i18n-js';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { buildUniqueTokenName } from '../../../helpers/assets';
import { colors, padding } from '../../../styles';
import { magicMemo } from '../../../utils';
import Pill from '../../Pill';
import { ContextCircleButton } from '../../context-menu';
import { ColumnWithMargins, FlexItem, Row, RowWithMargins } from '../../layout';
import { Text } from '../../text';

const paddingHorizontal = 19;
const paddingVertical = 3;

const UniqueTokenExpandedStateHeader = ({ asset }) => {
  const handleActionSheetPress = useCallback(
    buttonIndex => {
      if (buttonIndex === 0) {
        // View on OpenSea
        Linking.openURL(asset.permalink);
      }
    },
    [asset]
  );

  return (
    <Row
      align="center"
      css={padding(paddingVertical, paddingHorizontal, paddingHorizontal)}
      justify="space-between"
    >
      <ColumnWithMargins
        align="start"
        flexShrink={1}
        justify="start"
        margin={paddingVertical}
        paddingRight={paddingHorizontal}
      >
        <RowWithMargins align="center" margin={paddingVertical} marginLeft={1}>
          <Text
            color={colors.blueGreyDark50}
            letterSpacing="roundedTight"
            size="small"
            uppercase
            weight="semibold"
          >
            {asset.asset_contract.name}
          </Text>
          <Pill maxWidth={150}>#{asset.id}</Pill>
        </RowWithMargins>
        <FlexItem flex={1}>
          <Text letterSpacing="roundedTight" size="blarge" weight="bold">
            {buildUniqueTokenName(asset)}
          </Text>
        </FlexItem>
      </ColumnWithMargins>
      <ContextCircleButton
        flex={0}
        onPressActionSheet={handleActionSheetPress}
        options={['View on OpenSea', lang.t('wallet.action.cancel')]}
      />
    </Row>
  );
};

UniqueTokenExpandedStateHeader.propTypes = {
  asset: PropTypes.object,
};

export default magicMemo(UniqueTokenExpandedStateHeader, 'asset');
