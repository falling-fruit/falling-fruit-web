import { memo } from 'react'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'
import MapLabel from './MapLabel'
import { BackgroundMapPin, MapPin } from './Pins'

/**
 * Component for a location displayed on the map.
 * @param {function} onClick - The handler called when this location is clicked
 * @param {string} commonName - The common name of the location
 * @param {string} scientificName - The scientific name of the location
 * @param {boolean} showLabel - Whether to show the label
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

const ScientificName = styled.span`
  font-style: italic;
`

const Location = memo(
  ({
    showLabel,
    commonName,
    scientificName,
    selected,
    editing,
    onClick,
    ...props
  }) => {
    const label = commonName || scientificName
    const showScientificName = !commonName && scientificName

    return (
      <>
        {selected && !editing && <MapPin />}
        {editing && <BackgroundMapPin />}
        <LocationButton onClick={onClick} {...props}>
          {!showLabel && (
            <TooltipLabel>
              {showScientificName ? (
                <ScientificName>{label}</ScientificName>
              ) : (
                label
              )}
            </TooltipLabel>
          )}
        </LocationButton>
        {showLabel && (
          <MapLabel>
            {showScientificName ? (
              <ScientificName>{label}</ScientificName>
            ) : (
              label
            )}
          </MapLabel>
        )}
      </>
    )
  },
)

Location.displayName = 'Location'

export default Location
