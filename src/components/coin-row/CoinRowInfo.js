import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompact';
import styled from 'styled-components/primitives';
import { withCoinListEdited } from '../../hoc';
import { colors, padding } from '../../styles';
import { Column } from '../layout';
import BalanceText from './BalanceText';
import BottomRowText from './BottomRowText';
import CoinRow from './CoinRow';

const CoinRowPaddingTop = 9;
const CoinRowPaddingBottom = 9;

const Container = styled(Column).attrs({
  align: 'end',
  justify: 'space-between',
})`
  ${padding(CoinRowPaddingTop, 19, CoinRowPaddingBottom, 19)}
  height: ${CoinRow.height};
  opacity: ${({ isHidden }) => (isHidden ? 0.4 : 1)};
  width: 130px;
`;

const PercentageText = styled(BottomRowText).attrs({
  align: 'right',
})`
  color: ${({ isPositive }) => (isPositive ? colors.green : null)};
  margin-bottom: 0.5;
`;

const formatPercentageString = percentString =>
  percentString
    ? percentString
        .split('-')
        .join('- ')
        .split('%')
        .join(' %')
    : '-';

const CoinRowInfo = ({ isHidden, native }) => {
  const percentChange = get(native, 'change');
  const percentageChangeDisplay = formatPercentageString(percentChange);
  const isPositive = percentChange && percentageChangeDisplay.charAt(0) !== '-';

  return (
    <Container isHidden={isHidden}>
      <BalanceText numberOfLines={1}>
        {get(native, 'balance.display')}
      </BalanceText>
      <PercentageText isPositive={isPositive}>
        {percentageChangeDisplay}
      </PercentageText>
    </Container>
  );
};

CoinRowInfo.propTypes = {
  isHidden: PropTypes.bool,
  native: PropTypes.object,
};

export default compose(withCoinListEdited)(CoinRowInfo);
