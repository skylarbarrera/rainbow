import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { View } from 'react-native';
import { fonts, colors } from '../../styles';
import { ButtonPressAnimation } from '../animations';
import { Icon } from '../icons';

const Container = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 12px 7.5px;
`;

const IconWrapper = styled.View`
  height: 28px
  width: 28px;
  border-radius: 14px;
  background-color: ${colors.skeleton};
  justify-content: center;
  align-items: center;
  margin-left: 9.5;
  margin-right: 9px;
`;

const Nickname = styled.Text`
  font-family: ${fonts.family.SFProText};
  font-weight: ${fonts.weight.medium};
  font-size: ${fonts.size.smedium};
  color: ${colors.dark};
`;

const ProfileOption = ({
  accountAddress,
  accountName,
  isHeader,
}) => (
  <ButtonPressAnimation scaleTo={0.96}>
    <Container>
      <IconWrapper>
        <Icon
          color={colors.blueGreyMedium}
          height={15}
          width={15}
          name="gear"
        />
      </IconWrapper>
      <View>
        <Nickname>
          {accountName}
        </Nickname>
      </View>
    </Container>
  </ButtonPressAnimation>
);

ProfileOption.propTypes = {
  accountAddress: PropTypes.string.isRequired,
  accountName: PropTypes.string.isRequired,
  isHeader: PropTypes.bool,
};

ProfileOption.defaultProps = {
  isHeader: false,
};

export default ProfileOption;
