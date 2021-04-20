import { Map } from '@styled-icons/boxicons-solid'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'

/**
 * Component for a location displayed on the map.
 * @param {function} onClick - The handler called when this location is clicked
 */
const LocationButton = styled(ResetButton)`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => transparentize(0.25, theme.blue)};
  transform: translate(-50%, -50%);
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.12);

  &:focus {
    outline: none;
  }

  svg {
    position: absolute;
    transform: translate(-50%, -50%);
    top: -12px;
    filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.45));
    color: ${({ theme }) => theme.orange};
  }
`

const Location = ({ selected, ...props }) => (
  <LocationButton {...props}>{selected && <Map size={48} />}</LocationButton>
)

Location.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Location
