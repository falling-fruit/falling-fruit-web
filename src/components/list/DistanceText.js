import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

const METERS_IN_FOOT = 0.3048
const FEET_IN_MILE = 5280
const CONVERSION_THRESHOLD = 1000
const METERS_IN_KILOMETER = 1000
const IMPERIAL = 'imperial'

const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText};
`

const convertDistance = (distance, setting) => {
  if (setting === IMPERIAL) {
    const feet = Math.round(distance / METERS_IN_FOOT)
    if (feet < CONVERSION_THRESHOLD) {
      return `${parseFloat(feet.toPrecision(2))} feet`
    } else {
      return `${parseFloat((feet / FEET_IN_MILE).toPrecision(2))} miles`
    }
  } else {
    const meters = Math.round(distance)
    if (meters < CONVERSION_THRESHOLD) {
      return `${parseFloat(meters.toPrecision(2))} meters`
    } else {
      return `${parseFloat(
        (meters / METERS_IN_KILOMETER).toPrecision(2),
      )} kilometers`
    }
  }
}

const DistanceText = ({ distance }) => {
  const distanceUnit = useSelector((state) => state.settings.distanceUnit)

  return (
    <SecondaryText>{convertDistance(distance, distanceUnit)}</SecondaryText>
  )
}

export default DistanceText
