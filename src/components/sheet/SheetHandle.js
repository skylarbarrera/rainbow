import { VibrancyView } from '@react-native-community/blur';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/primitives';
import { colors } from '../../styles';

const Handle = styled.View`
  background-color: ${colors.alpha(colors.blueGreyDark, 0.3)};
  border-radius: 3;
  height: 5;
  overflow: hidden;
  width: 36;
`;

const SheetHandle = ({ showBlur, ...props }) => (
  <Handle
    {...props}
    as={showBlur ? VibrancyView : View}
    blurAmount={20}
    blurType="light"
  />
);

const neverRerender = () => true;
export default React.memo(SheetHandle, neverRerender);
