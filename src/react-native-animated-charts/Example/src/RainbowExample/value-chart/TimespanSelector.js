import React from 'react';
import styled from 'styled-components/primitives';
import Text from './Text';
import {JellySelector} from './jelly-selector';
import {colors, padding} from './styles';

const Centered = styled.View`
  justify-content: center;
  align-items: center;
`;

const Container = styled(Centered)`
  padding-top: 30;
  width: 100%;
  background-color: red;
`;

const Row = styled.View`
  flex-direction: row;
`;

const TimespanItemLabel = styled(Text).attrs(({color, isSelected}) => ({
  align: 'center',
  color: isSelected ? color : colors.alpha(colors.blueGreyDark, 0.4),
  letterSpacing: 'roundedTighter',
  size: 'smedium',
  weight: 'bold',
}))`
  ${padding(0, 9)};
`;

const TimespanItemRow = styled(Row).attrs({
  justify: 'space-around',
})`
  ${padding(0, 30)};
`;

const TimespanItem = ({color, isSelected, item, ...props}) => (
  <Centered flexShrink={0} height={32} {...props}>
    <TimespanItemLabel color={color} isSelected={isSelected}>
      {`1${item.charAt(0).toUpperCase()}`}
    </TimespanItemLabel>
  </Centered>
);

const timespans = ['h', 'd', 'w', 'm'];

const TimespanSelector = ({
  color = colors.dark,
  defaultIndex = 0,
  reloadChart,
}) => {
  return (
    <Container>
      <JellySelector
        backgroundColor={colors.alpha(color, 0.06)}
        color={color}
        defaultIndex={defaultIndex}
        enableHapticFeedback
        height={32}
        items={timespans}
        onSelect={reloadChart}
        renderItem={TimespanItem}
        renderRow={TimespanItemRow}
        scaleTo={1.2}
        width="100%"
      />
    </Container>
  );
};

export default React.memo(TimespanSelector);
