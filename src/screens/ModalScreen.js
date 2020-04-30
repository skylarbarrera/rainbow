import React, { createElement } from 'react';
import { StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import styled from 'styled-components/primitives';
import TouchableBackdrop from '../components/TouchableBackdrop';
import {
  AddContactState,
  SupportedCountriesExpandedState,
  SwapDetailsState,
} from '../components/expanded-state';
import { Centered } from '../components/layout';
import { padding, position } from '../styles';

const ModalTypes = {
  contact: AddContactState,
  supported_countries: SupportedCountriesExpandedState,
  swap_details: SwapDetailsState,
};

const Container = styled(Centered).attrs({ direction: 'column' })`
  ${({ top }) => padding(top || 0, 15, 0)};
  ${position.size('100%')};
`;

export default function ModalScreen(props) {
  const { top } = useSafeArea();

  const {
    goBack,
    state: { params },
  } = useNavigation();
  const type = useNavigationParam('type');

  return (
    <Container top={top}>
      <StatusBar barStyle="light-content" />
      <TouchableBackdrop onPress={goBack} />
      {createElement(ModalTypes[type], {
        ...params,
        ...props,
      })}
    </Container>
  );
}
