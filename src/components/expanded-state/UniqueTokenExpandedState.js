import withViewLayoutProps from '@hocs/with-view-layout-props';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigation, useIsFocused, useNavigationEvents } from 'react-navigation-hooks';
import { useSafeArea } from 'react-native-safe-area-context';

import { Transition, Transitioning } from 'react-native-reanimated';
import { useAccountAssets, useDimensions } from '../../hooks';
import { InteractionManager, Linking, ScrollView, Share, StyleSheet } from 'react-native';
import {
  compose,
  onlyUpdateForPropTypes,
  withHandlers,
  withProps,
} from 'recompact';
import { useSelector } from 'react-redux';
import { buildUniqueTokenName } from '../../helpers/assets';
import { withImageDimensionsCache } from '../../hoc';
import { colors, padding, position } from '../../styles';
import {
  deviceUtils,
  dimensionsPropType,
  safeAreaInsetValues,
} from '../../utils';
import { Centered, Column, ColumnWithMargins, Row, RowWithMargins } from '../layout';
import { Pager } from '../pager';
import { UniqueTokenAttributes, UniqueTokenImage } from '../unique-token';
import { AssetPanel, AssetPanelAction, AssetPanelHeader } from './asset-panel';
import FloatingPanel from './FloatingPanel';
import { Sheet, SheetHandle, SheetHandleFixedToTop, SheetActionButton, SheetActionButtonRow } from '../sheet';
import Divider from '../Divider';
import { Text } from '../text';
import { BalanceCoinRow } from '../coin-row';
import { ethereumUtils } from '../../utils';
import { APRPill } from '../savings';
import FloatingPanels from './FloatingPanels';

import SlackBottomSheet from 'react-native-slack-bottom-sheet';

const sx = StyleSheet.create({
  scrollview: {
    // height: '100%',
    backgroundColor: 'white',
    opacity: 1,
    flex: 1,
    paddingTop: 24,
    marginBottom: -20,
  },

});


const UniqueTokenExpandedStateHeader = ({ asset }) => {
  return (
    <Row align="center" justify="space-between" css={padding(3, 19, 19)}>
      <ColumnWithMargins align="start" margin={3}>
        <RowWithMargins align="center" margin={3} marginLeft={1}>
          <Text
            color={colors.alpha(colors.blueGreyDark, 0.5)}
            letterSpacing="looser"
            size="small"
            uppercase
            weight="semibold"
          >
            {asset.asset_contract.name}
          </Text>
          <APRPill>#{asset.id}</APRPill>
        </RowWithMargins>
        <Text letterSpacing="tightest" size="blarge" weight="bold">
          {asset.name}
        </Text>
      </ColumnWithMargins>
    </Row>
  );
}

const duration = 5500;
const transition = (
  <Transition.Sequence>
    <Transition.Out durationMs={duration} interpolation="linear" type="fade" />
    <Transition.Change durationMs={duration} interpolation="linear" />
    <Transition.In durationMs={duration} interpolation="linear" type="fade" />
  </Transition.Sequence>
);

const UniqueTokenExpandedState = ({
  asset,
  maxImageHeight,
  onLayout,
  onPressSend,
  onPressShare,
  imageDimensionsCache,
  onPressView,
  panelColor,
  panelHeight,
  panelWidth,
  subtitle,
  title,
}) => {
  const { allAssets } = useAccountAssets();
  const { goBack, navigate, ...lolnavigation } = useNavigation();

  const transitionRef = useRef();
  // const isFocused = useIsFocused();
  // console.log('lolnavigation', lolnavigation);

  const { height, width } = useDimensions();
  const insets = useSafeArea();

  const imageDimensions = useSelector(
    ({ imageDimensionsCache }) => imageDimensionsCache[asset.image_preview_url]
  );

  const {
    height: imageHeight,
    isSquare,
    width: imageWidth,
  } = imageDimensions;

  const selectedAsset = useMemo(
    () => ethereumUtils.getAsset(allAssets, asset.address) || asset,
    [allAssets, asset]
  );

  const handleNavigation = useCallback(
    route => {
      goBack();

      InteractionManager.runAfterInteractions(() => {
        navigate(route, { asset: selectedAsset });
      });
    },
    [goBack, navigate, selectedAsset]
  );

  const [isVisible, setIsVisible] = useState(false);

  const handleWillFocus = useCallback(
    (thing, other) => {
      const { type } = thing;
      console.log('thing ', thing, other);
      console.log('type', type);
      // type === 'willFocus' || type === 'willBlur' &&
      if (type === 'willFocus') {
        setIsVisible(true);
        // transitionRef.current.animateNextTransition();
      } else if (type === 'willBlur') {
        setIsVisible(false);
        // transitionRef.current.animateNextTransition();
      }
    },
    [setIsVisible]
  );
  const handlePressSend = useCallback(
    () => {},
    []
  );
//   //     navigation.goBack();

//   //     InteractionManager.runAfterInteractions(() => {
//   //       navigation.navigate('SendSheet', { asset });
//   //     });
//   //   },
  useNavigationEvents(handleWillFocus);

  // const handleWillDismiss = useCallback(
  //   (test) => {
  //     console.log(' ', test)
  //     goBack();
  //   },
  //   [goBack]
  // );
// if (transitionRef.current) {
//  transitionRef.current.animateNextTransition();
// }
      // onWillDismiss={handleWillDismiss}
  // console.log('width', width);
  // console.log('asset', asset);
  // console.log('maxImageHeight', maxImageHeight);
  // console.log('panelHeight', panelHeight);
  // console.log('imageDimensions', imageDimensions);
  // console.log('panelWidth', panelWidth);

  const maxImageWidth = width - (19 * 2);
  // console.log('maxImageWidth', maxImageWidth);
  // console.log('isVisible', isVisible);

  const handlePressShare = useCallback(() => {
    Share.share({
      title: `Share ${asset.name} Info`,
      url: asset.permalink,
    });
  }, [asset]);

  console.log(' ');
  // console.log('👀️👀️👀️👀️👀️ IS FOCUSED 👀️👀️👀️👀️👀️', isFocused);
  console.log(' ');







          // contentContainerStyle={{ marginBottom: 20 }}
      // topOffset={insets.top}
      // anchorModalToLongForm={true}
  return (
      <SlackBottomSheet
        allowsDragToDismiss={true}
        allowsTapToDismiss={true}
        backgroundOpacity={0.7}
        blocksBackgroundTouches={true}
        contentOffset={50}
        cornerRadius={24}
        headerHeight={50}
        initialAnimation={true}
        isHapticFeedbackEnabled={false}
        isShortFormEnabled={false}
        onDidDismiss={(test) => {
          test.persist();
          console.log('➡️ DID Dismiss DID INDEED DISMISS --- ', test);
          // InteractionManager.runAfterInteractions(() => goBack());
          goBack()
        }}
        onWillDismiss={(test) => {
          test.persist();
          console.log('➡️ onWillDismiss --- ', test);
          // goBack();
        }}
        onWillTransition={(test) => {
          test.persist();
          console.log(' ')
          console.log('⭐️⭐️⭐️⭐️ onWillTransition --- ', test);
          console.log(' ')
        }}
        presentGlobally={false}
        shouldRoundTopCorners={true}
        showDragIndicator={false}
        springDamping={0.8755}
        transitionDuration={0.420}
        unmountAnimation={true}
        visible={isVisible}
      >
        <Centered
          {...position.sizeAsObject('100%')}
          backgroundColor={colors.white}
          direction="column"
          width={width}
        >
          <SheetHandleFixedToTop />
          <ScrollView
            alwaysBounceVertical
            bounces
            style={sx.scrollview}
          >
            <UniqueTokenExpandedStateHeader asset={asset} />
            <Centered
              height={maxImageWidth * imageDimensions.height / imageDimensions.width}
              paddingHorizontal={19}
            >
              <Centered
                {...position.sizeAsObject('100%')}
                borderRadius={10}
                overflow="hidden"
              >
                <UniqueTokenImage
                  backgroundColor={asset.background}
                  imageUrl={asset.image_preview_url}
                  item={asset}
                  resizeMode="contain"
                />
              </Centered>
            </Centered>
            <SheetActionButtonRow>
              <SheetActionButton
                color={colors.dark}
                icon="share"
                label="Share"
                onPress={handlePressShare}
              />
              <SheetActionButton
                color={colors.paleBlue}
                icon="send"
                label="Send"
                onPress={() => handleNavigation('SendSheet')}
              />
            </SheetActionButtonRow>
            <Divider />
            <ColumnWithMargins
              flex={0}
              margin={12}
              paddingBottom={24}
              paddingHorizontal={19}
              paddingTop={19}
            >
              <Text
                letterSpacing="tight"
                lineHeight="normal"
                size="large"
                weight="bold"
              >
                Attributes
              </Text>
              <UniqueTokenAttributes {...asset} />
            </ColumnWithMargins>
            <Divider />
            <ColumnWithMargins
              flex={0}
              margin={12}
              paddingBottom={24}
              paddingHorizontal={19}
              paddingTop={19}
            >
              <Text
                letterSpacing="tight"
                lineHeight="normal"
                size="large"
                weight="bold"
              >
                About {asset.asset_contract.name}
              </Text>
              <Text
                color={colors.alpha(colors.blueGreyDark, 0.5)}
                lineHeight="looser"
                size="lmedium"
              >
                {asset.asset_contract.description}
              </Text>
            </ColumnWithMargins>
          </ScrollView>
        </Centered>
      </SlackBottomSheet>

  );
};

    // !isVisible ? null : )


    // <FloatingPanels width={100}>
    //   {!!maxImageHeight && (
    //     <Centered>
    //       <FloatingPanel
    //         color={panelColor}
    //         height={panelHeight}
    //         width={panelWidth}
    //       >
    //         {/*
    //             TODO XXX: THIS FLOATING PANEL SHOULD HAVE HORIZONTAL PADDING
    //             IF THE IMAGE IS A PERFECT SQUARE
    //         */}
    //         <Pager
    //           controlsProps={{
    //             bottom: UniqueTokenAttributes.padding,
    //             color: colors.getTextColorForBackground(
    //               panelColor,
    //               PagerControlsColorVariants
    //             ),
    //           }}
    //           dimensions={{ height: panelHeight, width: panelWidth }}
    //           pages={PanelPages}
    //         />
    //       </FloatingPanel>
    //     </Centered>
    //   )}
    //   <AssetPanel onLayout={onLayout}>
    //     <AssetPanelHeader subtitle={subtitle} title={title} />
    //     {asset.isSendable && (
    //       <AssetPanelAction
    //         icon="send"
    //         label="Send to..."
    //         onPress={onPressSend}
    //       />
    //     )}
    //     <AssetPanelAction
    //       icon="compass"
    //       label="View on OpenSea"
    //       onPress={onPressView}
    //     />
    //     <AssetPanelAction icon="share" label="Share" onPress={onPressShare} />
    //   </AssetPanel>
    // </FloatingPanels>

UniqueTokenExpandedState.propTypes = {
  asset: PropTypes.object,
  containerHeight: PropTypes.number,
  containerWidth: PropTypes.number,
  imageDimensions: dimensionsPropType,
  maxImageHeight: PropTypes.number,
  onLayout: PropTypes.func.isRequired,
  onPressSend: PropTypes.func,
  onPressShare: PropTypes.func,
  onPressView: PropTypes.func,
  panelColor: PropTypes.string,
  panelHeight: PropTypes.number.isRequired,
  panelWidth: PropTypes.number.isRequired,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

const buildPanelDimensions = ({
  asset: { background },
  imageDimensions,
  maxImageHeight,
  panelWidth,
}) => {
  const panelHeight = imageDimensions
    ? (panelWidth * imageDimensions.height) / imageDimensions.width
    : panelWidth;

  const panelDimensions = { panelHeight };

  if (panelHeight > maxImageHeight) {
    panelDimensions.panelHeight = maxImageHeight;
    panelDimensions.panelWidth = background
      ? panelWidth
      : (maxImageHeight * imageDimensions.width) / imageDimensions.height;
  }

  return panelDimensions;
};

export default UniqueTokenExpandedState;

// compose(
//   // withImageDimensionsCache,
//   // withViewLayoutProps(({ height: siblingHeight }) => {
//   //   const { bottom, top } = safeAreaInsetValues;

//   //   const viewportPadding = bottom ? bottom + top : top + top;
//   //   const viewportHeight = deviceUtils.dimensions.height - viewportPadding;
//   //   const maxImageHeight =
//   //     viewportHeight - siblingHeight - FloatingPanels.margin;

//   //   return { maxImageHeight };
//   // }),
//   // withProps(({ asset, imageDimensionsCache }) => ({
//   //   imageDimensions: imageDimensionsCache[asset.image_preview_url],
//   //   panelColor: asset.background || colors.lightestGrey,
//   //   subtitle: asset.name
//   //     ? `${asset.asset_contract.name} #${asset.id}`
//   //     : asset.asset_contract.name,
//   //   title: buildUniqueTokenName(asset),
//   // })),
//   // withProps(buildPanelDimensions),
//   // withHandlers({
//   //
//   //   onPressShare: ({ asset: { name, permalink } }) => () => {

//   //   },
//   //   onPressView: ({ asset: { permalink } }) => () => {
//   //     Linking.openURL(permalink);
//   //   },
//   // }),
//   // onlyUpdateForPropTypes
// )();
