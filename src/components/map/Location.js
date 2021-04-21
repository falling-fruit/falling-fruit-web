import { Map } from '@styled-icons/boxicons-solid'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'

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
const Location = ({ label, selected, ...props }) => (
  <>
    <LocationButton {...props}>{selected && <Map size={48} />}</LocationButton>
    <Label>{label}</Label>
  </>
)
Location.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
}

export default Location
