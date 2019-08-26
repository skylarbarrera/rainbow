import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles';
import { deviceUtils } from '../../utils';
import { Centered, Column } from '../layout';
import TouchableBackdrop from '../TouchableBackdrop';

const ModalElement = styled(Column)`
  background-color: ${colors.white};
  border-radius: ${({ radius }) => radius || 12};
  flex-shrink: 0;
  height: ${({ height }) => height};
  width: 100%;
`;

const Modal = ({
  fixedToTop,
  height,
  onCloseModal,
  statusBarStyle,
  containerPadding,
  ...props
}) => (
  <Centered
    style={{ justifyContent: fixedToTop ? 'flex-start' : 'center', top: fixedToTop ? 91 : 0 }}
    direction="column"
    height="100%"
    padding={containerPadding}
    width="100%"
  >
    <TouchableBackdrop onPress={onCloseModal} />
    <ModalElement
      {...props}
      height={height}
    />
  </Centered>
);

Modal.propTypes = {
  fixedToTop: PropTypes.bool,
  containerPadding: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onCloseModal: PropTypes.func,
  statusBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
};

Modal.defaultProps = {
  fixedToTop: false,
  containerPadding: 15,
  height: deviceUtils.dimensions.height - 230,
  onCloseModal: () => null,
  statusBarStyle: 'light-content',
};

export default Modal;
