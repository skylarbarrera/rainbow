import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useAccountAssets } from '../../hooks';
import { ethereumUtils } from '../../utils';
import Chart from '../value-chart/Chart';
import { BalanceCoinRow } from '../coin-row';
import { colors } from '../../styles';
import Divider from '../Divider';
import { Sheet, SheetActionButton, SheetActionButtonRow } from '../sheet';

const ChartExpandedState = ({ asset }) => {
  const { allAssets } = useAccountAssets();
  const { goBack, navigate } = useNavigation();

  const selectedAsset = useMemo(
    () => ethereumUtils.getAsset(allAssets, asset.address) || asset,
    [allAssets, asset]
  );

  const handleNavigation = useCallback(
    route => {
      goBack();

      InteractionManager.runAfterInteractions(() => {
        navigate(route, { asset: selectedAsset });
      });
    },
    [goBack, navigate, selectedAsset]
  );

  return (
    <Sheet>
      <BalanceCoinRow {...selectedAsset} isExpandedState />
      <SheetActionButtonRow>
        <SheetActionButton
          color={colors.dodgerBlue}
          icon="swap"
          label="Swap"
          onPress={() => handleNavigation('ExchangeModal')}
        />
        <SheetActionButton
          color={colors.paleBlue}
          icon="send"
          label="Send"
          onPress={() => handleNavigation('SendSheet')}
        />
      </SheetActionButtonRow>
      <Divider />
      <Chart />
    </Sheet>
  );
};

ChartExpandedState.propTypes = {
  asset: PropTypes.object,
};

export default React.memo(ChartExpandedState);
