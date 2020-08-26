import {BigNumber} from 'bignumber.js';
import React, {useEffect, useMemo} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import styled from 'styled-components/primitives';
import CoinIcon from '../CoinIcon';
import {colors, padding} from '../styles';
import {
  ChartDateLabel,
  ChartHeaderSubtitle,
  ChartPercentChangeLabel,
  ChartPriceLabel,
} from './chart-data-labels';

const supportedNativeCurrencies = {
  USD: {
    alignment: 'left',
    assetLimit: 1,
    currency: 'USD',
    decimals: 2,
    emojiName: 'us',
    label: 'United States Dollar',
    mask: '[099999999999]{.}[00]',
    placeholder: '0.00',
    smallThreshold: 1,
    symbol: '$',
  },
};

const noPriceData = 'No price data';

const handleSignificantDecimals = (value, decimals, buffer) => {
  if (
    !BigNumber(`${decimals}`).isInteger() ||
    (buffer && !BigNumber(`${buffer}`).isInteger())
  ) {
    return null;
  }
  buffer = buffer ? convertStringToNumber(buffer) : 3;
  decimals = convertStringToNumber(decimals);
  if (lessThan(BigNumber(`${value}`).abs(), 1)) {
    decimals =
      BigNumber(`${value}`)
        .toFixed()
        .slice(2)
        .slice('')
        .search(/[^0]/g) + buffer;
    decimals = decimals < 8 ? decimals : 8;
  } else {
    decimals = decimals < buffer ? decimals : buffer;
  }
  let result = BigNumber(`${value}`).toFixed(decimals);
  result = BigNumber(`${result}`).toFixed();
  return BigNumber(`${result}`).dp() <= 2
    ? BigNumber(`${result}`).toFormat(2)
    : BigNumber(`${result}`).toFormat();
};

export const convertAmountToNativeDisplay = (value, nativeCurrency, buffer) => {
  const nativeSelected = supportedNativeCurrencies[nativeCurrency];
  const {decimals} = nativeSelected;
  const display = handleSignificantDecimals(value, decimals, buffer);
  if (nativeSelected.alignment === 'left') {
    return `${nativeSelected.symbol}${display}`;
  }
  return `${display} ${nativeSelected.currency}`;
};

export const convertStringToNumber = value => BigNumber(`${value}`).toNumber();

export const lessThan = (numberOne, numberTwo) =>
  BigNumber(`${numberOne}`).lt(numberTwo);

const ColumnWithMargins = styled.View`
  flex-direction: column
  margin: 20
`;

const Row = styled.View`
  flex-direction: row;
`;

const RowWithMargins = styled.View`
  flex-direction: row;
  margin: 20;
`;

const Container = styled(ColumnWithMargins).attrs({
  margin: 12,
})`
  ${({showChart}) => padding(0, 19, showChart ? 30 : 0)};
`;

export default function ChartExpandedStateHeader({
  asset,
  color = colors.dark,
  latestChange,
  latestPrice = noPriceData,
  chartTimeSharedValue,
}) {
  const isNoPriceData = latestPrice === noPriceData;

  const price = useMemo(
    () => convertAmountToNativeDisplay(latestPrice, 'USD'),
    [latestPrice]
  );

  const priceSharedValue = useSharedValue('');

  useEffect(() => {
    if (!isNoPriceData) {
      priceSharedValue.value = price;
    } else {
      priceSharedValue.value = '';
    }
  }, [price, isNoPriceData, priceSharedValue]);

  const coinIconShadow = useMemo(
    () => [[0, 4, 12, asset?.shadowColor || color, 0.3]],
    [asset, color]
  );

  return (
    <Container>
      <Row align="center" justify="space-between">
        <CoinIcon
          address={asset?.address}
          shadow={coinIconShadow}
          symbol={asset?.symbol}
        />
      </Row>
      <RowWithMargins align="center" justify="space-between" margin={12}>
        <ColumnWithMargins align="start" flex={1} margin={1}>
          <ChartPriceLabel
            defaultValue={isNoPriceData ? asset?.name : price}
            isNoPriceData={isNoPriceData}
            priceSharedValue={priceSharedValue}
          />
          <ChartHeaderSubtitle>
            {isNoPriceData ? noPriceData : asset?.name}
          </ChartHeaderSubtitle>
        </ColumnWithMargins>
        <ColumnWithMargins align="end" margin={1}>
          <ChartPercentChangeLabel latestChange={latestChange} />
          <ChartDateLabel chartTimeSharedValue={chartTimeSharedValue} />
        </ColumnWithMargins>
      </RowWithMargins>
    </Container>
  );
}
