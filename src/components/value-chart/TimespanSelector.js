import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useValues } from 'react-native-redash';
import { useDimensions } from '../../hooks';
import { borders } from '../../styles';
import { ButtonPressAnimation } from '../animations';
import { Row } from '../layout';
import ValueTime from './ValueTime';

const springConfig = {
  damping: 38,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
  stiffness: 600,
};

const interval = {
  DAY: 0,
  MONTH: 2,
  WEEK: 1,
  YEAR: 3,
};

const indicatorSize = 30;
const sx = StyleSheet.create({
  indicator: {
    ...borders.buildCircleAsObject(indicatorSize),
    marginBottom: -indicatorSize,
    position: 'absolute',
    zIndex: 10,
  },
});

const TimespanSelector = ({ color, isLoading, reloadChart }) => {
  const { width } = useDimensions();
  const [timespan, setTimespan] = useState(0);

  const bottomSpaceWidth = width / 8;
  const [translateX] = useValues([Math.round(-bottomSpaceWidth * 3)], []);

  const animateTransition = useCallback(
    index => {
      Animated.spring(translateX, {
        toValue: Math.floor(bottomSpaceWidth * (index * 2 - 3)),
        ...springConfig,
      }).start();
    },
    [bottomSpaceWidth, translateX]
  );

  const selectTimespan = useCallback(
    newTimespan => {
      animateTransition(newTimespan);
      setTimespan(newTimespan);
      reloadChart(newTimespan);
    },
    [animateTransition, reloadChart, setTimespan]
  );

  return (
    <Row align="center" justify="center" width="100%">
      <Animated.View
        style={[
          sx.indicator,
          {
            backgroundColor: isLoading ? 'gray' : color,
            transform: [{ translateX: translateX }],
          },
        ]}
      />
      <Row align="center" justify="space-around" width={width} zIndex={11}>
        <ButtonPressAnimation onPress={() => selectTimespan(interval.DAY)}>
          <ValueTime selected={timespan === interval.DAY}>1D</ValueTime>
        </ButtonPressAnimation>
        <ButtonPressAnimation onPress={() => selectTimespan(interval.WEEK)}>
          <ValueTime selected={timespan === interval.WEEK}>1W</ValueTime>
        </ButtonPressAnimation>
        <ButtonPressAnimation onPress={() => selectTimespan(interval.MONTH)}>
          <ValueTime selected={timespan === interval.MONTH}>1M</ValueTime>
        </ButtonPressAnimation>
        <ButtonPressAnimation onPress={() => selectTimespan(interval.YEAR)}>
          <ValueTime selected={timespan === interval.YEAR}>1Y</ValueTime>
        </ButtonPressAnimation>
      </Row>
    </Row>
  );
};

TimespanSelector.propTypes = {
  color: PropTypes.string,
  isLoading: PropTypes.bool,
  reloadChart: PropTypes.func,
};

export default React.memo(TimespanSelector);
