import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { pure } from 'recompact';
import { ButtonPressAnimation } from '../animations';
import { colors } from '../../styles';
import FastImage from 'react-native-fast-image';
import Caret from '../../assets/family-dropdown-arrow.png';
import AvatarImageSource from '../../assets/avatar.png';
import RotationArrow from '../animations/RotationArrow';

const Container = styled.View`
  height: 46px;
  width: 175px;
  background-color: ${colors.skeleton};
  margin-left: 4px;
  border-radius: 23px;
  align-items: center;
  flex-direction: row;
`;

const RightSide = styled.View`

`;

const TopRow = styled.View`
  flex-direction: row;
`;

const BottomRow = styled.View`

`;

const Nickname = styled.Text`

`;

const Address = styled.Text`

`;

const SettingIcon = styled(FastImage)`
  height: 12px;
  width: 6px;
  transform: rotate(90deg);
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
      <RightSide>
        <TopRow>
          <Nickname>
            Mike Demarais
          </Nickname>
          <SettingIcon source={Caret} />
        </TopRow>
        <BottomRow>
          <Address>
            Address
          </Address>
        </BottomRow>
      </RightSide>
    </Container>
  </ButtonPressAnimation>
);

HeaderButton.propTypes = {
  ...ButtonPressAnimation.propTypes,
  children: PropTypes.node,
  onPress: PropTypes.func.isRequired,
};

export default pure(HeaderButton);
