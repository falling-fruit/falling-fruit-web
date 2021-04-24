import { ArrowBack } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const BackButton = styled(ResetButton).attrs((props) => ({
  children: <ArrowBack />,
  ...props,
}))`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 15px;
  font-weight: bold;
`

export default BackButton
