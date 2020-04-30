import React from 'react';
import { borders, colors } from '../../styles';
import { Icon } from '../icons';
import { Centered } from '../layout';
import ContextMenu from './ContextMenu';

export default function ContextCircleButton(props) {
  return (
    <ContextMenu {...props} activeOpacity={1}>
      <Centered
        {...borders.buildCircleAsObject(42)}
        backgroundColor={colors.alpha(colors.blueGreyDark, 0.06)}
      >
        <Icon color={colors.alpha(colors.blueGreyDark, 0.4)} name="threeDots" />
      </Centered>
    </ContextMenu>
  );
}
