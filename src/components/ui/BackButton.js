import { ArrowBack } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

const BackButton = styled.button.attrs((props) => ({
  children: <ArrowBack />,
  ...props,
}))`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 15px;
  font-weight: bold;

  /* Reset button styles */
  cursor: pointer;
  font-family: inherit;
  border: 0;
  padding: 0;
  background: none;
`

export default BackButton
