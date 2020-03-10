import React from 'react';
import stylePropType from 'react-style-proptype';
import { colors } from '../../styles';
import { Text } from '../text';

const TimestampText = ({ style, ...props }) => (
  <Text
    {...props}
    align="center"
    color={colors.blueGreyDark}
    lineHeight={17}
    style={[
      style,
      {
        marginLeft: -15,
        opacity: 0.5,
      },
    ]}
  />
);

TimestampText.propTypes = {
  style: stylePropType,
};

export default TimestampText;
