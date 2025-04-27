import styled from 'styled-components/macro'

import ResetButton from './ResetButton'
import ReturnIcon from './ReturnIcon'

const BackButton = styled(ResetButton).attrs((props) => ({
  children: <ReturnIcon />,
  ...props,
}))`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9375rem;
  font-weight: bold;
`

export default BackButton
