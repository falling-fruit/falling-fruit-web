import { Map } from '@styled-icons/boxicons-solid'
import PropTypes from 'prop-types'
import { memo } from 'react'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'
import Label from './Label'

const MapPin = styled(Map)`
  // TODO: adjust intrusiveness of pin
  height: 48px;
  z-index: 3;
  color: ${({ theme }) => theme.orange};

  position: absolute;
  transform: translate(-50%, -50%);
  top: -20px;
  filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.45));
  color: ${({ theme }) => theme.orange};
`

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

const Location = memo(({ label, selected, onClick, ...props }) => (
  <>
    {selected && <MapPin />}
    <LocationButton onClick={onClick} {...props} />
    <Label>{label}</Label>
  </>
))

Location.displayName = 'Location'

Location.propTypes = {
  onClick: PropTypes.func,
  // TODO: Correct the instance in MapPage
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

export default Location
