import styled from 'styled-components/primitives';
import {buildTextStyles} from './styles';

const Text = styled.Text.attrs({allowFontScaling: false})`
  ${buildTextStyles};
`;

export default Text;
