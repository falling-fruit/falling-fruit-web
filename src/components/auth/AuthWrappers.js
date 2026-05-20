import styled from 'styled-components'

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.invalid} !important;
  margin-block-start: 0.25em;
  font-style: italic;
  font-size: 0.875rem !important;
`
