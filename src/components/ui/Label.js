import styled from 'styled-components/macro'

import { validatedColor } from '../ui/GlobalStyle'

const Label = styled.label`
  display: block;
  margin: 16px 0 8px 0;
  font-size: 0.875rem;
  color: ${validatedColor('tertiaryText')};
`

export default Label
