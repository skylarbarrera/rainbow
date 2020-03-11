import React from 'react';
import { StyleSheet } from 'react-native';
import { Centered } from '../layout';
import { SheetHandle } from '../sheet';

const sx = StyleSheet.create({
  container: {
    left: 0,
    paddingBottom: 15,
    paddingTop: 6,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9,
  },
});

export default function SheetHandleFixedToTop() {
  return (
    <Centered style={sx.container}>
      <SheetHandle showBlur />
    </Centered>
  );
}
