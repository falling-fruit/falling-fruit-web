import PropTypes from 'prop-types'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { dismissEditingTooltip } from '../../redux/locationSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'
import ResetButton from '../ui/ResetButton'
import Label from './Label'
import Tooltip from './LocationTooltip'
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

const Location = memo(({ label, selected, editing, onClick, ...props }) => {
  const dispatch = useDispatch()
  const editingTooltipOpen = useSelector(
    (state) => state.location.editingTooltipOpen,
  )
  const isDesktop = useIsDesktop()

  return (
    <>
      {selected && !editing && <MapPin />}
      {editing && <BackgroundMapPin />}
      <LocationButton onClick={onClick} {...props} />
      <Label>{label}</Label>
      {editing && editingTooltipOpen && isDesktop && (
        <Tooltip onClose={() => dispatch(dismissEditingTooltip())} />
      )}
    </>
  )
})

Location.displayName = 'Location'

Location.propTypes = {
  onClick: PropTypes.func,
  // TODO: Correct the instance in MapPage
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

export default Location
