import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const SquareButton = styled(ResetButton)`
  display: flex;
  height: 22px;
  width: 22px;
  border: 1px solid
    ${({ disabled, theme }) =>
      disabled ? theme.secondaryBackground : theme.orange};
  border-radius: 5px;

  svg {
    color: ${({ disabled, theme }) =>
      disabled ? theme.secondaryBackground : theme.orange};
  }
`

export default SquareButton
