import PropTypes from 'prop-types';
import React, { createElement } from 'react';
import { StyleSheet, View } from 'react-native';
import stylePropType from 'react-style-proptype';
import { VibrancyView } from '@react-native-community/blur';
import { colors } from '../../styles';

const sx = StyleSheet.create({
  handle: {
    backgroundColor: colors.alpha(colors.blueGreyDark, 0.3),
    borderRadius: 3,
    height: 5,
    overflow: 'hidden',
    width: 36,
  },
});

const blurConfig = {
  blurAmount: 20,
  blurType: 'light',
};

const SheetHandle = ({ showBlur, style, ...props }) =>
  createElement(showBlur ? VibrancyView : View, {
    ...props,
    ...(showBlur ? blurConfig : {}),
    style: [sx.handle, style],
  });

SheetHandle.propTypes = {
  showBlur: PropTypes.bool,
  style: stylePropType,
};

const neverRerender = () => true;
export default React.memo(SheetHandle, neverRerender);
