import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import { ReactComponent as CrosshairIcon } from './crosshair-medium-green.svg'
import Label from './Label'

const PlaceLabel = styled(Label)`
  font-size: 1rem;
  margin-top: 20px;
  z-index: 3;
  pointer-events: none;
  touch-action: none;
`

const PlaceCrosshair = styled(CrosshairIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  background-color: transparent;
  pointer-events: none;
  touch-action: none;
`

const Place = ({ label, ...props }) => (
  <>
    <PlaceCrosshair {...props} />
    <PlaceLabel>{label}</PlaceLabel>
  </>
)

Place.propTypes = {
  label: PropTypes.string,
}

export default Place
