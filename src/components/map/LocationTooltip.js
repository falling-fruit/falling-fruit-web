import { X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

const TooltipContainer = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  top: -170px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 4;
  font-size: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: ${({ theme }) => theme.background} transparent transparent
      transparent;
  }
`

const TooltipContent = styled.div`
  padding: 8px;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 4px;
  top: 4px;
`

const Tooltip = ({ onClose }) => (
  <TooltipContainer>
    <CloseButton
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <X size={20} />
    </CloseButton>
    <TooltipContent>
      <b>Move to the position of the source.</b>
      <br />
      <br />
      Check the satellite view - the source may be visible from space!
      <br />
      <br />
    </TooltipContent>
  </TooltipContainer>
)

export default Tooltip
