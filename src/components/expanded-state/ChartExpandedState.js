import { get } from 'lodash';
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
import { useNavigation } from 'react-navigation-hooks';
import styled from 'styled-components/primitives';
import { withAccountData, withAccountSettings } from '../../hoc';
import { ethereumUtils, deviceUtils } from '../../utils';
import Chart from '../value-chart/Chart';
import { BalanceCoinRow } from '../coin-row';
import { Centered } from '../layout';
import BottomSendButtons from '../value-chart/BottomSendButtons';
import { colors } from '../../styles';
import Divider from '../Divider';
import { Sheet, SheetActionButton, SheetActionButtonRow } from '../sheet';
import { Icon } from '../icons';
import { SavingsSheetHeader } from '../savings';

const ChartContainer = styled.View`
  align-items: center;
  overflow: hidden;
  padding-bottom: ${deviceUtils.isTallPhone ? '60px' : '30px'};
  padding-top: 18px;
`;

const BottomContainer = styled.View`
  padding-bottom: 24px;
  width: 100%;
  height: 100px;
`;

const Container = styled.View`
  align-items: center;
  background-color: ${colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  bottom: -200;
  padding-bottom: 200;
  position: absolute;
  width: ${deviceUtils.dimensions.width};
`;

const ChartExpandedState = ({
  asset,

  selectedAsset,
}) => {
  const { goBack, navigate } = useNavigation();

  const handlePressSend = useCallback(() => {
    goBack();

    InteractionManager.runAfterInteractions(() => {
      navigate('SendSheet', { asset });
    });
  }, [asset, goBack, navigate]);

  const handlePressSwap = useCallback(() => {
    goBack();

    InteractionManager.runAfterInteractions(() => {
      navigate('ExchangeModal', { asset });
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
        isExpandedState={true}
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
  }),
)(ChartExpandedState);
