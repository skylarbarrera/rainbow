import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { abbreviations } from '../../utils';
import { TruncatedAddress } from '../text';
import { fonts, colors } from '../../styles';
import AvatarImageSource from '../../assets/avatar.png';
import { ButtonPressAnimation } from '../animations';

const Container = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 7.5px;
`;

const Nickname = styled.Text`
  font-family: ${fonts.family.SFProText};
  font-weight: ${fonts.weight.medium};
  font-size: ${fonts.size.smedium};
  color: ${colors.dark};
`;

const AddressAbbreviation = styled(TruncatedAddress).attrs({
  firstSectionLength: abbreviations.defaultNumCharsPerSection,
  size: 'smaller',
  truncationLength: 4,
  weight: 'medium',
})`
  font-family: ${fonts.family.SFProText};
  width: 100%;
  opacity: 0.5;
`;

const ProfileRow = ({
  accountAddress,
  accountName,
  isHeader,
  onPress,
}) => (
  <ButtonPressAnimation scaleTo={0.96} onPress={onPress}>
    <Container>
      <FastImage
        source={AvatarImageSource}
        style={{
          height: isHeader ? 37 : 33,
          marginLeft: 5,
          marginRight: isHeader ? 2 : 4,
          marginTop: isHeader ? 4 : 3.5,
          width: isHeader ? 37 : 35,
        }}
      />
      <View>
        <Nickname>
          {accountName}
        </Nickname>
        <AddressAbbreviation address={accountAddress} />
      </View>
    </Container>
  </ButtonPressAnimation>
);

ProfileRow.propTypes = {
  accountAddress: PropTypes.string.isRequired,
  accountName: PropTypes.string.isRequired,
  isHeader: PropTypes.bool,
  onPress: PropTypes.func,
};

ProfileRow.defaultProps = {
  isHeader: false,
};

export default ProfileRow;
