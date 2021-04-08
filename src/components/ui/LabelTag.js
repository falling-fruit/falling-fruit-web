import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const LabelTag = styled.span`
  border-radius: 4px;
  vertical-align: 0.25em;
  height: 15px;
  padding: 2px;
  margin-left: 5px;
  font-size: 9px;
  font-weight: bold;
  color: ${validatedColor('text', 'background')};
  background-color: ${validatedColor('secondaryBackground')};
  text-transform: uppercase;
`
export default LabelTag
