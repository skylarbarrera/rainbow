import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { pure } from 'recompact';
import { ButtonPressAnimation } from '../animations';
import { colors } from '../../styles';
import FastImage from 'react-native-fast-image';
import AvatarImageSource from '../../assets/avatar.png';

const Container = styled.View`
  height: 46px;
  width: 175px;
  background-color: ${colors.skeleton};
  margin-left: 4px;
  border-radius: 23px;
  align-items: center;
  flex-direction: row;
`;

const TopRow = styled.View`
`;

const BottomRow = styled.View`
`;

const HeaderButton = ({
  children,
  onPress,
  transformOrigin,
}) => (
  <ButtonPressAnimation onPress={onPress} scaleTo={0.90}>
    <Container>
      <FastImage
        source={AvatarImageSource}
        style={{
          height: 32,
          marginLeft: 7,
          width: 32,
        }}
      />
      <TopRow>

      </TopRow>
      <BottomRow>
        
      </BottomRow>
    </Container>
  </ButtonPressAnimation>
);

HeaderButton.propTypes = {
  ...ButtonPressAnimation.propTypes,
  children: PropTypes.node,
  onPress: PropTypes.func.isRequired,
};

export default pure(HeaderButton);
