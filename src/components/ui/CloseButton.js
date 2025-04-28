import { X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

const TopRightButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 0;
  position: absolute;
  inset-inline-end: 4px;
  inset-block-start: 4px;
`

const CloseButton = (props) => (
  <TopRightButton {...props}>
    <X size={20} />
  </TopRightButton>
)

export default CloseButton
