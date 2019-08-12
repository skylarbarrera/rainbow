import React from 'react';
import styled from 'styled-components/primitives';
import { colors } from '../../styles';

const DividerWrapper = styled.View`
  padding-top: 2px;
  padding-bottom: 4px;
`;

const Divider = styled.View`
  opacity: 0.04;
  height: 2px;
  width: 100%;
  background-color: ${colors.blueGreyLigter};
`;

const ProfileDivider = () => (
  <DividerWrapper>
    <Divider />
  </DividerWrapper>
);

export default ProfileDivider;
