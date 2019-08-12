import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { pure } from 'recompact';
import FastImage from 'react-native-fast-image';
import { ButtonPressAnimation } from '../animations';
import { colors, fonts } from '../../styles';
import Caret from '../../assets/family-dropdown-arrow.png';
import AvatarImageSource from '../../assets/avatar.png';
import { TruncatedAddress } from '../text';

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

const ArrowWrapper = styled.View`
  height: 16px;
  width: 12px;
  padding-left: 8px;
  padding-top: 2px;
  justify-content: center;
  align-items: center;
`;

const Nickname = styled.Text`
  font-family: ${fonts.family.SFProText};
  font-weight: ${fonts.weight.medium};
  font-size: ${fonts.size.smedium};
  color: ${colors.dark};
`;

const SettingIcon = styled(FastImage)`
  height: 12px;
  width: 6px;
  transform: rotate(90deg);
`;

const AddressAbbreviation = styled(TruncatedAddress).attrs({
  firstSectionLength: 6,
  size: 'smaller',
  truncationLength: 4,
  weight: 'medium',
})`
  font-family: ${fonts.family.SFProText};
  width: 100%;
  opacity: 0.5;
`;


const HeaderProfileInfo = ({
  accountAddress,
  displayName,
  onPress,
}) => (
  <ButtonPressAnimation onPress={onPress} scaleTo={0.90}>
    <Container>
      <FastImage
        source={AvatarImageSource}
        style={{
          height: 33,
          marginLeft: 7,
          marginRight: 3,
          marginTop: 4,
          width: 35,
        }}
      />
      <RightSide>
        <TopRow>
          <Nickname>
            {displayName}
          </Nickname>
          <ArrowWrapper>
            <SettingIcon source={Caret} />
          </ArrowWrapper>
        </TopRow>
        <AddressAbbreviation address={accountAddress} />
      </RightSide>
    </Container>
  </ButtonPressAnimation>
);

HeaderProfileInfo.propTypes = {
  accountAddress: PropTypes.string,
  displayName: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

export default pure(HeaderProfileInfo);
