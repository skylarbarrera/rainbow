import PropTypes from 'prop-types';
import React, { Fragment, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import { withProps } from 'recompact';
import { colors } from '../../styles';
import { Icon } from '../icons';
import { RowWithMargins } from '../layout';
import { Rounded, TruncatedText } from '../text';

const sx = StyleSheet.create({
  container: {
    height: 85,
    paddingLeft: 15,
    width: '100%',
  },
});

const TruncatedRounded = withProps({ component: Rounded })(TruncatedText);

const Subtitle = props => (
  <TruncatedRounded
    color={colors.blueGreyLight}
    letterSpacing="tooLoose"
    size="smedium"
    weight="semibold"
    {...props}
  />
);

const Title = props => <TruncatedRounded size="h2" weight="bold" {...props} />;

const transition = (
  <Transition.Together>
    <Transition.Out
      durationMs={220}
      interpolation="easeInOut"
      propagation="right"
      type="slide-top"
    />
    <Transition.In
      delayMs={120}
      durationMs={200}
      propagation="left"
      type="fade"
    />
  </Transition.Together>
);

const ValueText = props => {
  const { change, direction, headerText, value } = props;
  const transitionRef = useRef();

  if (transitionRef.current) {
    transitionRef.current.animateNextTransition();
  }

  return (
    <Transitioning.View
      ref={transitionRef}
      style={sx.container}
      transition={transition}
    >
      {value ? (
        <Fragment>
          <Subtitle>{headerText}</Subtitle>
          <Title>${value}</Title>
          <RowWithMargins align="center" margin={2} marginTop={2}>
            <Icon
              color={direction ? colors.chartGreen : colors.red}
              direction={direction ? 'right' : 'left'}
              fat
              height={15}
              name="arrow"
              width={13}
            />
            <Rounded
              color={direction ? colors.chartGreen : colors.red}
              letterSpacing="looser"
              lineHeight="loose"
              size="large"
              weight="bold"
            >
              {Math.abs(Number(change))}%
            </Rounded>
          </RowWithMargins>
        </Fragment>
      ) : (
        <Fragment>
          <Subtitle>Downloading data...</Subtitle>
          <Title>Loading...</Title>
        </Fragment>
      )}
    </Transitioning.View>
  );
};

ValueText.propTypes = {
  change: PropTypes.string,
  direction: PropTypes.bool,
  headerText: PropTypes.string,
  value: PropTypes.number,
};

export default React.memo(ValueText);
