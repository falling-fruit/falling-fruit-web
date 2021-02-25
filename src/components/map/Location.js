import PropTypes from 'prop-types'
import styled from 'styled-components'

// TODO: Location styling/icon that Siraj wants
/**
 * Component for a location displayed on the map.
 * @param {function} onClick - The handler called when this location is clicked
 */
const Location = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: red;
  transform: translate(-50%, -50%);
`

Location.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Location
