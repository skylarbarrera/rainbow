import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import Chart from './Chart';
import {asset, pointsD, pointsH, pointsM, pointsW} from './data';
import useChartDataLabels from './useChartDataLabels';
const color = '#E15EE5';

export default function ChartExpandedState() {
  const [chartType, setChartType] = useState('d');

  const points = useMemo(() => {
    if (chartType === 'd') {
      return pointsD;
    }
    if (chartType === 'w') {
      return pointsW;
    }
    if (chartType === 'm') {
      return pointsM;
    }
    if (chartType === 'h') {
      return pointsH;
    }
  }, [chartType]);

  const initialChartDataLabels = useChartDataLabels({
    asset,
    chartType,
    color,
    points,
  });
  return (
    <View style={{backgroundColor: 'white'}}>
      <Chart
        {...initialChartDataLabels}
        asset={asset}
        chartType={chartType}
        color={color}
        fetchingCharts={false}
        points={points}
        updateChartType={setChartType}
      />
    </View>
  );
}
