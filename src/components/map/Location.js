import { memo } from 'react'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'
import MapLabel from './MapLabel'
import { BackgroundMapPin, MapPin } from './Pins'

/**
 * Component for a location displayed on the map.
 * @param {function} onClick - The handler called when this location is clicked
 * @param {boolean} label - The optional location label that will appear underneath location icon
 */
const LocationButton = styled(ResetButton)`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.blue};
  transform: translate(-50%, -50%);

  border: 2px solid ${({ theme }) => theme.background};
  z-index: 2;

  &:focus {
    outline: none;
  }

  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'unset')};
`

const TooltipLabel = styled(MapLabel)`
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  top: 21px; // offset by LocationButton's width + MapLabel's margin-top

  ${LocationButton}:hover & {
    opacity: 1;
  }
`

const Location = memo(
  ({ showLabel, label, selected, editing, onClick, ...props }) => (
    <>
      {selected && !editing && <MapPin />}
      {editing && <BackgroundMapPin />}
      <LocationButton onClick={onClick} {...props}>
        {!showLabel && <TooltipLabel>{label}</TooltipLabel>}
      </LocationButton>
      {showLabel && <MapLabel>{label}</MapLabel>}
    </>
  ),
)

Location.displayName = 'Location'

export default Location
