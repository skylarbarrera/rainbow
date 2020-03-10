import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Transition, Transitioning } from 'react-native-reanimated';
import styled from 'styled-components/primitives';
import { useDimensions } from '../../hooks';
import { colors, fonts } from '../../styles';
import { AnimatedNumber } from '../animations';
import { Row } from '../layout';
import { TruncatedText } from '../text';
import TrendIndicatorText from './TrendIndicatorText';

const HeadingTextStyles = {
  color: colors.dark,
  weight: 'bold',
};

const Title = styled(TruncatedText).attrs(HeadingTextStyles)`
  font-size: 30px;
  margin-bottom: 6.5px;
`;

const Header = styled(TruncatedText)`
  font-size: ${fonts.size.smedium};
  color: ${colors.alpha(colors.blueGreyDark, 0.5)};
  font-weight: ${fonts.weight.semibold};
`;

const transition = (
  <Transition.Together>
    <Transition.Out
      durationMs={220}
      type="slide-top"
      propagation="right"
      interpolation="easeInOut"
    />
    <Transition.In
      durationMs={200}
      delayMs={120}
      type="fade"
      propagation="left"
    />
  </Transition.Together>
);

const ValueText = props => {
  const { change, direction, headerText, value } = props;
  const { width } = useDimensions();
  const transitionRef = useRef();

  // const currentValue = useRef(value);
  // useEffect(() => {
  //   // setText(value);
  //   transitionRef.current.animateNextTransition();
  // }, [value]);

                  // value={ref}
  return (
    <View
      style={{
        height: 85,
        paddingLeft: 15,
        width,
      }}
    >
      <Transitioning.View ref={transitionRef} transition={transition}>
        {value ? (
          <View>
            <Header>{headerText}</Header>
            <Row align="center">
              <Title>$</Title>
                <AnimatedNumber
                  disableTabularNums
                  textAlign="left"
                  formatter={thing => `${Number(thing).toFixed(2)}`}
                  value={value}
                  style={{
                    ...HeadingTextStyles,
                    fontSize: 30,
                    fontWeight: fonts.weight.bold,
                    marginBottom: 6.5,
                  }}
                />
            </Row>
            <TrendIndicatorText direction={direction}>
              {Math.abs(Number(change))}%
            </TrendIndicatorText>
          </View>
        ) : (
          <Fragment>
            <Header>Downloading data...</Header>
            <Title>Loading...</Title>
          </Fragment>
        )}
      </Transitioning.View>
    </View>
  );
};

ValueText.propTypes = {
  change: PropTypes.string,
  direction: PropTypes.bool,
  headerText: PropTypes.string,
  value: PropTypes.number,
};

export default React.memo(ValueText);
