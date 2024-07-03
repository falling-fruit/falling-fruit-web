import { Map } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

/**
 * Map icon has an 8% border at the top and the bottom.
 * Bottom of pin is thus 92% from the top and 42% from the center.
 */

const AddLocationPin = styled(Map)`
  height: 57px;
  color: ${({ theme }) => theme.blue};
  position: absolute;
  top: 50%;
  left: 50%;
  // How to do this without transform/should I?
  transform: translate(-50%, -92%);
  // Display on top of map
  z-index: 1;
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`

const MapPin = styled(Map)`
  // TODO: adjust intrusiveness of pin
  height: 48px;
  z-index: 4;

  position: absolute;
  transform: translate(-50%, -50%);
  top: -20.16px;
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.45));
  color: ${({ theme }) => theme.orange};
`

const EditLocationPin = styled(Map)`
  height: 48px;
  z-index: 4;

  position: absolute;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.45));
  color: ${({ theme }) => theme.orange};
  top: 50%;
  left: 50%;
  // How to do this without transform/should I?
  transform: translate(-50%, -92%);
  // Display on top of map
  z-index: 1;
  // Allow clicking/dragging through the pin
  pointer-events: none;
  touch-action: none;
`
const BackgroundMapPin = styled(Map)`
  height: 48px;
  z-index: 3;
  position: absolute;
  transform: translate(-50%, -50%);
  top: -20.16px;
  color: ${({ theme }) => theme.transparentOrange};
`

export { AddLocationPin, BackgroundMapPin, EditLocationPin, MapPin }
