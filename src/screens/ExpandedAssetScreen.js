import PropTypes from 'prop-types';
import React, { createElement } from 'react';
import { StatusBar } from 'react-native';
import {
  AddContactState,
  ChartExpandedState,
  InvestmentExpandedState,
  SwapDetailsState,
  TokenExpandedState,
  UniqueTokenExpandedState,
} from '../components/expanded-state';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { Centered } from '../components/layout';
import TouchableBackdrop from '../components/TouchableBackdrop';
import { padding } from '../styles';
import { useDimensions } from '../hooks';

const ScreenTypes = {
  chart: ChartExpandedState,
  contact: AddContactState,
  swap_details: SwapDetailsState,
  token: TokenExpandedState,
  unique_token: UniqueTokenExpandedState,
  uniswap: InvestmentExpandedState,
};

const ExpandedAssetScreen = ({ containerPadding, ...props }) => {
  const { height, width } = useDimensions();
  const insets = useSafeArea();

  const {
    goBack,
    state: { params },
  } = useNavigation();
  const type = useNavigationParam('type');

  return (
    <Centered
      css={padding(insets.top, containerPadding, 0)}
      direction="column"
      height={height}
      width={width}
    >
      <StatusBar barStyle="light-content" />
      <TouchableBackdrop onPress={() => goBack()} />
      {createElement(ScreenTypes[type], {
        ...params,
        ...props,
        panelWidth: width - containerPadding * 2,
      })}
    </Centered>
  );
};

ExpandedAssetScreen.propTypes = {
  containerPadding: PropTypes.number.isRequired,
};

ExpandedAssetScreen.defaultProps = {
  containerPadding: 15,
};

export default React.memo(ExpandedAssetScreen);
