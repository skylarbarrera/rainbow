import { get, isEmpty } from 'lodash';
import React, { useMemo, useState } from 'react';
import { Easing } from 'react-native-reanimated';
import { bin, mixColor, useTimingTransition } from 'react-native-redash';
import { chartExpandedAvailable } from '../../config/experimental';
import { greaterThan, toFixedDecimals } from '../../helpers/utilities';
import { useCharts } from '../../hooks';
import { colors } from '../../styles';
import { Column } from '../layout';
import TimespanSelector from './TimespanSelector';
import ValueChart from './ValueChart';
import ValueText from './ValueText';
import { data1, data2, data3, dataColored2, dataColored3 } from './data';

const dataSwitching2 = [
  [data2],
  [data1],
  [dataColored2, dataColored3],
  [data3],
];

const colorsArray = [
  colors.red,
  colors.grey,
  colors.green,
  colors.purple,
  colors.red,
  colors.green,
  colors.red,
  colors.purple,
  colors.green,
  colors.grey,
  colors.green,
  colors.purple,
];

const chartStroke = { detailed: 1.5, simplified: 3 };

let colorIndex = 0;

const Chart = ({ asset, ...props }) => {
  const { chart, updateChartType } = useCharts(asset);

  console.log('chart', chart);

  const hasChart = chartExpandedAvailable || !isEmpty(chart);
  const change = get(asset, 'price.relative_change_24h', 0);

  const data2 = useMemo(() => {
    colorIndex = 0;
    return dataSwitching2.map((sectionsData, index) => {
      return {
        name: index,
        segments: sectionsData.map((data, i) => {
          return {
            color: colorsArray[colorIndex++],
            line: i * 5,
            points: data.map(values => {
              return { x: values[0], y: values[1] };
            }),
            renderStartSeparator:
              colorIndex % 2 !== 0
                ? {
                    fill: colorsArray[colorIndex],
                    r: 7,
                    stroke: 'white',
                    strokeWidth: colorIndex + 2,
                  }
                : undefined,
          };
        }),
      };
    });
  }, []);

  const [curVal, setCurVal] = useState(0);
  const positiveChange = greaterThan(change, 0);

  const timespanIndicatorColorAnimation = useTimingTransition(
    bin(positiveChange),
    {
      duration: 100,
      ease: Easing.out(Easing.ease),
    }
  );

  const timespanIndicatorColor = mixColor(
    timespanIndicatorColorAnimation,
    colors.red,
    colors.chartGreen
  );

  return (
    <Column
      overflow="hidden"
      paddingBottom={21}
      paddingTop={19}
      width="100%"
      {...props}
    >
      <ValueText
        change={toFixedDecimals(change, 2)}
        direction={positiveChange}
        headerText="PRICE"
        value={curVal}
      />
      {hasChart && (
        <ValueChart
          amountOfPathPoints={100}
          barColor={positiveChange ? colors.chartGreen : colors.red}
          currentDataSource={chart}
          data={data2}
          enableSelect
          importantPointsIndexInterval={25}
          mode="gesture-managed"
          onValueUpdate={setCurVal}
          stroke={chartStroke}
        />
      )}
      <TimespanSelector
        color={timespanIndicatorColor}
        isLoading={false}
        reloadChart={updateChartType}
      />
    </Column>
  );
};

export default React.memo(Chart);
