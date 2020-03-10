import { get, isEmpty, reverse } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { InteractionManager } from 'react-native';
import {
  compose,
  onlyUpdateForKeys,
  withHandlers,
  withProps,
  withState,
} from 'recompact';
import styled from 'styled-components/primitives';
import { chartExpandedAvailable } from '../../config/experimental';
import { useCharts } from '../../hooks';
import { useNavigation } from 'react-navigation-hooks';
import { withAccountData, withAccountSettings } from '../../hoc';
import Routes from '../../screens/Routes/routesNames';
import { ethereumUtils, deviceUtils } from '../../utils';
import Chart from '../value-chart/Chart';
import { BalanceCoinRow } from '../coin-row';
import { Centered } from '../layout';
import BottomSendButtons from '../value-chart/BottomSendButtons';
import { colors } from '../../styles';
import Divider from '../Divider';
import { Icon } from '../icons';
import { Sheet, SheetActionButton, SheetActionButtonRow } from '../sheet';
import { SavingsSheetHeader } from '../savings';

const ChartContainer = styled.View`
  align-items: center;
  overflow: hidden;
  padding-bottom: ${deviceUtils.isTallPhone ? '60px' : '30px'};
  padding-top: 18px;
`;

const ChartExpandedState = ({ asset, selectedAsset }) => {
  const { goBack, navigate } = useNavigation();
  const { charts } = useCharts();

  const chart = reverse(get(charts, `${asset.address}`, []));
  const hasChart = chartExpandedAvailable || !isEmpty(chart);
  const change = get(asset, 'price.relative_change_24h', 0);

  const handlePressSend = useCallback(() => {
    goBack();

    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(Routes.SEND_SHEET, { asset });
    });
  }, [asset, goBack, navigate]);

  const handlePressSwap = useCallback(() => {
    goBack();

    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(Routes.EXCHANGE_MODAL, { asset });
    });
  }, [asset, goBack, navigate]);

  return (
    <Sheet>
      <SavingsSheetHeader />
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
          onPress={handlePressSwap}
        />
        <SheetActionButton
          color={colors.paleBlue}
          icon="send"
          label="Send"
          onPress={handlePressSend}
        />
      </SheetActionButtonRow>
      {hasChart && (
        <ChartContainer>
          <Chart change={change} />
        </ChartContainer>
      )}
    </Sheet>
  );
};




      // <Divider />
      // <ChartContainer>
      //   <Chart />
      // </ChartContainer>

ChartExpandedState.propTypes = {
  change: PropTypes.string,
  changeDirection: PropTypes.bool,
  isOpen: PropTypes.bool,
  onPressSend: PropTypes.func,
  onPressSwap: PropTypes.func,
  price: PropTypes.string,
  selectedAsset: PropTypes.object,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

export default compose(
  withAccountData,
  withAccountSettings,
  withProps(({ asset: { address, ...asset }, assets }) => {
    let selectedAsset = ethereumUtils.getAsset(assets, address);
    if (!selectedAsset) {
      selectedAsset = asset;
    }
    return {
      change: get(selectedAsset, 'native.change', '-'),
      changeDirection: get(selectedAsset, 'price.relative_change_24h', 0) > 0,
      selectedAsset,
    };
  })
)(ChartExpandedState);
