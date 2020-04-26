import PropTypes from 'prop-types';
import React, { createElement, useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
// import SlackBottomSheet from 'react-native-slack-bottom-sheet';
import { useNavigation, useNavigationEvents } from 'react-navigation-hooks';
import { useDimensions } from '../../hooks';
import { colors } from '../../styles';
import { Centered } from '../layout';
import SheetHandleFixedToTop from './SheetHandleFixedToTop';

const sx = StyleSheet.create({
  scrollview: {
    // height: '100%',
    backgroundColor: 'white',
    flex: 1,
    marginBottom: -20,
    opacity: 1,
    paddingTop: 24,
  },
});

const SlackSheetConfig = {
  allowsDragToDismiss: true,
  allowsTapToDismiss: true,
  backgroundOpacity: 0.7,
  blocksBackgroundTouches: true,
  initialAnimation: true,
  isHapticFeedbackEnabled: false,
  isShortFormEnabled: false,
  presentGlobally: false,
  shouldRoundTopCorners: true,
  showDragIndicator: false,
  unmountAnimation: true,
};

const SlackSheet = ({
  cornerRadius = 24,
  headerHeight,
  scrollEnabled,
  springDamping,
  topOffset,
  transitionDuration,
  ...props
}) => {
  const { width } = useDimensions();
  const { goBack } = useNavigation();
  const insets = useSafeArea();
  const [isVisible, setIsVisible] = useState(false);

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: insets.bottom * 2,
      width,
    }),
    [insets, width]
  );

  const scrollIndicatorInsets = useMemo(
    () => ({
      bottom: insets.bottom * 2,
      top: 26 + cornerRadius,
    }),
    [cornerRadius, insets]
  );

  const handleWillFocus = useCallback(
    ({ type }) => {
      if (type === 'willFocus') {
        setIsVisible(true);
      } else if (type === 'willBlur') {
        setIsVisible(false);
      }
    },
    [setIsVisible]
  );

  useNavigationEvents(handleWillFocus);

  return (
    <Centered backgroundColor={colors.white} direction="column" width={width}>
      <SheetHandleFixedToTop />
      {createElement(scrollEnabled ? ScrollView : View, {
        ...props,
        alwaysBounceVertical: true,
        bounces: true,
        contentContainerStyle: contentContainerStyle,
        directionalLockEnabled: true,
        scrollIndicatorInsets: scrollIndicatorInsets,
        style: sx.scrollview,
      })}
    </Centered>
  );
};


    // <SlackBottomSheet
    //   {...SlackSheetConfig}
    //   cornerRadius={cornerRadius}
    //   headerHeight={headerHeight}
    //   onDidDismiss={() => goBack()}
    //   springDamping={springDamping}
    //   topOffset={topOffset}
    //   transitionDuration={transitionDuration}
    //   visible={isVisible}
    // >
    // </SlackBottomSheet>

SlackSheet.propTypes = {
  cornerRadius: PropTypes.number,
  headerHeight: PropTypes.number,
  scrollEnabled: PropTypes.bool,
  springDamping: PropTypes.number,
  topOffset: PropTypes.number,
  transitionDuration: PropTypes.number,
};

SlackSheet.defaultProps = {
  scrollEnabled: true,
  springDamping: 0.8755,
  transitionDuration: 0.42,
};

export default SlackSheet;
