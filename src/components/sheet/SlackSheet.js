import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import styled from 'styled-components/primitives';
import { colors, position } from '../../styles';
import { Centered } from '../layout';
import SheetHandleFixedToTop from './SheetHandleFixedToTop';

const SheetBorderRadius = 24;

const Container = styled(Centered).attrs({ direction: 'column' })`
  ${position.size('100%')};
  background-color: ${colors.white};
  border-radius: ${SheetBorderRadius};
  overflow: hidden;
`;

const Content = styled.View`
  background-color: ${colors.white};
  flex: 1;
  height: 100%;
  margin-bottom: -20;
  opacity: 1;
  padding-top: 24;
`;

const SlackSheet = ({ cornerRadius = 24, scrollEnabled = true, ...props }) => {
  const insets = useSafeArea();
  const bottomInset = insets.bottom * 2;

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: bottomInset,
    }),
    [bottomInset]
  );

  const scrollIndicatorInsets = useMemo(
    () => ({
      bottom: bottomInset,
      top: 26 + cornerRadius,
    }),
    [bottomInset, cornerRadius]
  );

  return (
    <Container>
      <SheetHandleFixedToTop />
      <Content
        {...props}
        alwaysBounceVertical
        as={scrollEnabled ? ScrollView : View}
        bounces
        contentContainerStyle={contentContainerStyle}
        directionalLockEnabled
        scrollIndicatorInsets={scrollIndicatorInsets}
      />
    </Container>
  );
};

SlackSheet.propTypes = {
  cornerRadius: PropTypes.number,
  scrollEnabled: PropTypes.bool,
};

export default SlackSheet;
