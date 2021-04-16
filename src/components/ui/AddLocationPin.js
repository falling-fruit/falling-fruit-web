import styled from 'styled-components/macro'

import PinSvg from './AddLocationPin.svg'

const AddLocationPin = styled.img.attrs({
  src: PinSvg,
})`
  position: absolute;
  top: 50%;
  left: 50%;
  // How to do this without transform/should I?
  transform: translate(-50%, -100%);
  // Display on top of map
  z-index: 1;
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`

export default AddLocationPin
