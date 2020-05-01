import React from 'react';
import styled from 'styled-components/primitives';
import { Centered } from '../layout';
import SheetHandle from './SheetHandle';

const Container = styled(Centered)`
  left: 0;
  padding-bottom: 15;
  padding-top: 6;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
`;

export default function SheetHandleFixedToTop() {
  return (
    <Container>
      <SheetHandle showBlur />
    </Container>
  );
}
