import React, { createElement } from 'react';
import { StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigationState } from 'react-navigation-hooks';
import styled from 'styled-components/primitives';
import {
  ChartExpandedState,
  InvestmentExpandedState,
  TokenExpandedState,
  UniqueTokenExpandedState,
} from '../components/expanded-state';
import { Centered } from '../components/layout';
import { position } from '../styles';

const ScreenTypes = {
  chart: ChartExpandedState,
  token: TokenExpandedState,
  unique_token: UniqueTokenExpandedState,
  uniswap: InvestmentExpandedState,
};

const Container = styled(Centered).attrs({ direction: 'column' })`
  ${position.size('100%')};
  ${position.cover};
  padding-top: ${({ top }) => top || 0};
`;

export default function ExpandedAssetSheet(props) {
  const { params } = useNavigationState();
  const { top } = useSafeArea();
  return (
    <Container top={top}>
      <StatusBar barStyle="light-content" />
      {createElement(ScreenTypes[params.type], {
        ...params,
        ...props,
      })}
    </Container>
  );
}
