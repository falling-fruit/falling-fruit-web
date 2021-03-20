import PropTypes from 'prop-types'
import styled from 'styled-components'

/**
 * Component for a location displayed on the map.
 * @param {function} onClick - The handler called when this location is clicked
 */
const Location = styled.button`
  width: 15px;
  height: 15px;
  padding: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.blue};
  transform: translate(-50%, -50%);
  border: none;
  cursor: pointer;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.12);
  opacity: 0.75;

  &:focus {
    outline: none;
  }
`

Location.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Location
