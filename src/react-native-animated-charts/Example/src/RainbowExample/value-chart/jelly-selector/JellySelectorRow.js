import {createElement} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/primitives';

const Row = styled.View`
  flex-direction: row;
  background-color: red;
  height: 10;
  width: ${({width}) => width};
`;

export default function JellySelectorRow({renderRow = Row, ...props}) {
  const {width} = Dimensions.get('window');

  return createElement(renderRow, {
    width,
    zIndex: 11,
    ...props,
  });
}
