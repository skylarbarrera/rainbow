import PropTypes from 'prop-types';
import React from 'react';
import { Path } from 'svgs';
import { colors } from '../../../styles';
import Svg from '../Svg';

/* eslint-disable max-len */
const PlusIcon = ({ color, ...props }) => (
  <Svg height="24" width="24" viewBox="0 0 24 24" {...props}>
    <Path
      d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
      fill={color}
      fillRule="nonzero"
    />
  </Svg>
);
/* eslint-disable max-len */

PlusIcon.propTypes = {
  color: PropTypes.string,
};

PlusIcon.defaultProps = {
  color: colors.white,
};

export default PlusIcon;
