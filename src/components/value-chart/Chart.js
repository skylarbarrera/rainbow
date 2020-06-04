import { get, isEmpty } from 'lodash';
import React, { useMemo, useState } from 'react';
import { Easing } from 'react-native-reanimated';
import {
  bin,
  bInterpolateColor,
  useTimingTransition,
} from 'react-native-redash';
import ChartTypes from '../../helpers/chartTypes';
import { greaterThan, toFixedDecimals } from '../../helpers/utilities';
import { useCharts } from '../../hooks';
import { colors } from '../../styles';
import { Column } from '../layout';
import AnimatedChart from './AnimatedChart';
import TimespanSelector from './TimespanSelector';
import ValueChart from './ValueChart';
import ValueText from './ValueText';
import { data1, data2, data3, data4 } from './data';

const dataSwitching2 = [[data1], [data2], [data4], [data3]];

const chartStroke = { detailed: 1.5, simplified: 3 };

const Chart = ({ asset, ...props }) => {
  // const { chart, chartType, updateChartType } = useCharts(asset);
  const [currentChartIndex, setCurrentChartIndex] = useState('h');

  // const hasChart = !isEmpty(chart);
  const change = get(asset, 'price.relative_change_24h', 0);

  const data = useMemo(() => {
    return dataSwitching2.map((sectionsData, index) => {
      return {
        name: index,
        segments: sectionsData.map((data, i) => {
          return {
            color: colors.green,
            line: i * 5,
            points: data.map(values => {
              return { x: values[0], y: values[1] };
            }),
            renderStartSeparator: undefined,
          };
        }),
      };
    });
  }, []);

  // const chartData = useMemo(() => {
  //   if (!chart || !hasChart) return [];
  //   return [[chart, chart]].map((sectionsData, index) => {
  //     return {
  //       name: index,
  //       segments: sectionsData.map((data, i) => ({
  //         color: colors.green,
  //         line: i * 5,
  //         points: data.map(([x, y]) => ({ x, y })),
  //         renderStartSeparator: undefined,
  //       })),
  //     };
  //   });
  // }, [chart, hasChart]);

  const [currentPrice, setCurrentPrice] = useState(0);
  const positiveChange = greaterThan(change, 0);

  const timespanIndicatorColorAnimation = useTimingTransition(
    bin(positiveChange),
    {
      duration: 100,
      ease: Easing.out(Easing.ease),
    }
  );

  const timespanIndicatorColor = bInterpolateColor(
    timespanIndicatorColorAnimation,
    colors.red,
    colors.chartGreen
  );

  // const currentChartIndex = Object.values(ChartTypes).indexOf(chartType);
  const amountOfPathPoints = 30; // 👈️ TODO make this dynamic

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
        value={currentPrice}
      />
      <ValueChart
        amountOfPathPoints={120}
        barColor={positiveChange ? colors.chartGreen : colors.red}
        currentDataSource={currentChartIndex}
        data={data}
        enableSelect
        importantPointsIndexInterval={amountOfPathPoints}
        mode="gesture-managed"
        onValueUpdate={setCurrentPrice}
        stroke={chartStroke}
      />
      <TimespanSelector
        color={timespanIndicatorColor}
        defaultIndex={0}
        isLoading={false}
        reloadChart={selected => {
          setCurrentChartIndex(selected);
        }}
      />
    </Column>
  );
};

export default React.memo(Chart);
