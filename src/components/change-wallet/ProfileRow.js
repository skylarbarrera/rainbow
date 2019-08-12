import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/primitives';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { abbreviations } from '../../utils';
import { TruncatedAddress } from '../text';

const Container = styled(View)`

`;

const Name = styled(Text)`

`;

const AddressAbbreviation = styled(TruncatedAddress).attrs({
  align: 'center',
  firstSectionLength: abbreviations.defaultNumCharsPerSection,
  size: 'big',
  truncationLength: 4,
  weight: 'bold',
})`
  width: 100%;
`;

const ProfileRow = ({
  accountAddress,
  accountName,
  isHeader,
}) => (
  <Container>
    <Name>
      {accountName}
    </Name>
    <AddressAbbreviation address={accountAddress} />
  </Container>
);

ProfileRow.propTypes = {
  accountAddress: PropTypes.string.isRequired,
  accountName: PropTypes.string.isRequired,
  isHeader: PropTypes.bool,
};

ProfileRow.defaultProps = {
  isHeader: false,
};

export default ProfileRow;