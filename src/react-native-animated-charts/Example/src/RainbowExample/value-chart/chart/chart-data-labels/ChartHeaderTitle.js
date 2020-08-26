import styled from 'styled-components/primitives';
import Text from '../../Text';
import {colors} from '../../styles';

const ChartHeaderTitle = styled(Text).attrs(({color = colors.dark}) => ({
  color,
  letterSpacing: 'roundedTight',
  size: 'big',
  weight: 'bold',
}))``;

export default ChartHeaderTitle;
