import PropTypes from 'prop-types'
import { memo } from 'react'
import styled from 'styled-components/macro'

/**
 * Component for a location displayed on the map.
 * @param {function} onClick - The handler called when this location is clicked
 * @param {boolean} label - The optional location label that will appear underneath location icon
 */
const LocationButton = styled.button`
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

const Label = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.headerText};
  text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.45);
  margin-top: -5px;
  /* Centers labels under each location */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* Centers text inside the label */
  text-align: center;
  /* Prevents line breaks */
  white-space: nowrap;
  z-index: 1;
`

const Location = memo(({ label, ...props }) => (
  <>
    <LocationButton {...props} />
    <Label>{label}</Label>
  </>
))

Location.displayName = 'Location'

Location.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
}

export default Location
