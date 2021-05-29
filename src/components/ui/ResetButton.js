import styled from 'styled-components/macro'

const ResetButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  // outline: inherit;
  // TODO: should outline be removed? a11y

  ${({ disabled }) => !disabled && 'cursor: pointer;'}
`

export default ResetButton
