import PropTypes from 'prop-types';
import React from 'react';
import RadialGradient from 'react-native-radial-gradient';
import { colors } from '../../styles';
import { TruncatedText } from '../text';

const APRPill = ({ children, ...props }) => (
  <RadialGradient
    borderRadius={10}
    center={[0, 10]}
    colors={[colors.alpha('#F2F5F7', 0.8), colors.alpha('#DFE4EB', 0.8)]}
    overflow="hidden"
    paddingBottom={3}
    paddingHorizontal={5}
    paddingTop={2}
    radius={81}
    {...props}
  >
    <TruncatedText
      color={colors.alpha(colors.blueGreyDark, 0.5)}
      size="small"
      weight="semibold"
    >
      {children}
    </TruncatedText>
  </RadialGradient>
);

APRPill.propTypes = {
  children: PropTypes.node,
};

export default APRPill;
