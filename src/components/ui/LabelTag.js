import styled from 'styled-components/macro'

import { validatedColor } from './GlobalStyle'

const LabelTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 4px;
  height: 15px;
  padding: 2px;
  font-size: 9px;
  font-weight: bold;
  color: ${validatedColor('background', 'text')};
  background-color: ${validatedColor('secondaryBackground')};
  text-transform: uppercase;
  margin-left: 5px;
`
export default LabelTag
