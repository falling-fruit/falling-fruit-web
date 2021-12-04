import { X as ClearIcon } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'

const StyledButton = styled(ResetButton)`
  color: inherit;
`

const ClearSearchButton = (props) => (
  <StyledButton {...props}>
    <ClearIcon height="10px" />
  </StyledButton>
)

export default ClearSearchButton
