import {BigNumber} from 'bignumber.js';
import {useCallback, useMemo} from 'react';

const toFixedDecimals = (value, decimals) =>
  BigNumber(`${value}`).toFixed(decimals);

const formatPercentChange = (change = 0) => toFixedDecimals(change, 2);

export default function useChartDataLabels({asset, chartType, points}) {
  const latestPrice = asset?.native?.price.amount;

  const getPercentChangeForPrice = useCallback(
    startPrice => {
      const endPrice = points?.[points.length - 1].y || latestPrice;
      const percent = ((endPrice - startPrice) / startPrice) * 100;
      return formatPercentChange(percent);
    },
    [latestPrice, points]
  );

  const latestChange = useMemo(
    () =>
      !points || chartType === 'd'
        ? formatPercentChange(asset?.price?.relative_change_24h)
        : getPercentChangeForPrice(points[0].y),
    [asset, chartType, getPercentChangeForPrice, points]
  );

  return {
    latestChange,
    latestPrice,
  };
}
