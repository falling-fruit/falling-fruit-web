import { Map } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const AddLocationCentralUnmovablePin = styled(Map)`
  height: 57px;
  color: ${({ theme }) => theme.blue};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -92%);
  // Display on top of map
  z-index: 1;
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`
const EditLocationCentralUnmovablePin = styled(Map)`
  height: 48px;
  z-index: 4;

  position: absolute;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.orange};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -92%);
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`

export { AddLocationCentralUnmovablePin, EditLocationCentralUnmovablePin }
