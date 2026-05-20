import styled from 'styled-components/macro'

import { validatedColor } from '../ui/GlobalStyle'

const Label = styled.label`
  display: block;
  margin-block: 1em 0.5em;
  margin-inline: 0;
  font-size: 0.875rem;
  color: ${validatedColor('tertiaryText')};
`

export default Label
