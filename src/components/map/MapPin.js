import { Map } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const MapPin = styled(Map)`
  // TODO: adjust intrusiveness of pin
  height: 48px;
  z-index: 4;

  position: absolute;
  transform: translate(-50%, -50%);
  top: -20px;
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.45));
  color: ${({ theme }) => theme.orange};
`
export default MapPin
