import { get, isEmpty, reverse } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import styled from 'styled-components/primitives';
import { chartExpandedAvailable } from '../../config/experimental';
import { useAccountAssets, useCharts } from '../../hooks';
import Routes from '../../screens/Routes/routesNames';
import { colors } from '../../styles';
import { deviceUtils, ethereumUtils } from '../../utils';
import Divider from '../Divider';
import { BalanceCoinRow } from '../coin-row';
import { Sheet, SheetActionButton, SheetActionButtonRow } from '../sheet';
import Chart from '../value-chart/Chart';

const ChartContainer = styled.View`
  align-items: center;
  overflow: hidden;
  padding-bottom: ${deviceUtils.isTallPhone ? '60px' : '30px'};
  padding-top: 18px;
`;

const ChartExpandedState = ({ asset }) => {
  const { allAssets } = useAccountAssets();
  const { goBack, navigate } = useNavigation();
  const { charts } = useCharts();

  const chart = reverse(get(charts, `${asset.address}`, []));
  const hasChart = chartExpandedAvailable || !isEmpty(chart);
  const change = get(asset, 'price.relative_change_24h', 0);

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
      <BalanceCoinRow
        {...selectedAsset}
        containerStyles={`
          padding-top: 0;
          padding-bottom: 0;
        `}
        isExpandedState
      />
      <SheetActionButtonRow>
        <SheetActionButton
          color={colors.dodgerBlue}
          icon="swap"
          label="Swap"
          onPress={() => handleNavigation(Routes.EXCHANGE_MODAL)}
        />
        <SheetActionButton
          color={colors.paleBlue}
          icon="send"
          label="Send"
          onPress={() => handleNavigation(Routes.SEND_SHEET)}
        />
      </SheetActionButtonRow>
      {hasChart && (
        <Fragment>
          <Divider />
          <ChartContainer>
            <Chart change={change} />
          </ChartContainer>
        </Fragment>
      )}
    </Sheet>
  );
};

ChartExpandedState.propTypes = {
  asset: PropTypes.object,
};

export default React.memo(ChartExpandedState);
