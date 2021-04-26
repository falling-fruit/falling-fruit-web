import styled from 'styled-components/macro'

import { validatedColor } from '../ui/GlobalStyle'

const Textarea = styled.textarea`
  border: 1px solid ${validatedColor()};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 15px 20px;
  resize: vertical;
  color: ${({ theme }) => theme.secondaryText};
  font-family: inherit;
  font-size: 18px;
  width: 100%;
  height: 140px;

  &::placeholder {
    color: ${({ theme }) => theme.tertiaryText};
    font-family: ${({ theme }) => theme.fonts};
  }
`

export default Textarea
