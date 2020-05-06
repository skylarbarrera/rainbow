import { get, reverse } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chartsUpdateChartType } from '../redux/charts';

export default function useCharts(asset) {
  const dispatch = useDispatch();

  const { charts, fetchingCharts } = useSelector(
    ({ charts: { charts, fetchingCharts } }) => ({
      charts,
      fetchingCharts,
    }),
    (p, n) => p.fetchingCharts === n.fetchingCharts
  );

  const chart = useMemo(() => reverse(get(charts, `${asset.address}`, [])), [
    asset.address,
    charts,
  ]);

  const updateChartType = useCallback(
    chartType => dispatch(chartsUpdateChartType(chartType)),
    [dispatch]
  );

  return {
    chart,
    charts,
    fetchingCharts,
    updateChartType,
  };
}
