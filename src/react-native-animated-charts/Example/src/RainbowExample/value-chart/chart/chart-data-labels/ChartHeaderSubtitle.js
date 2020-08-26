import styled from 'styled-components/primitives';
import Text from '../../Text';
import {colors} from '../../styles';

const ChartHeaderSubtitle = styled(Text).attrs(
  ({
    color = colors.alpha(colors.blueGreyDark, 0.8),
    letterSpacing = 'roundedMedium',
  }) => ({
    color,
    letterSpacing,
    size: 'larger',
    weight: 'medium',
  })
)``;

export default ChartHeaderSubtitle;
