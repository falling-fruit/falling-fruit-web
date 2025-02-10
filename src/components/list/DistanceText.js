import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { IMPERIAL } from '../../constants/list'

const METERS_IN_FOOT = 0.3048
const FEET_IN_MILE = 5280
const CONVERSION_THRESHOLD = 1000
const METERS_IN_KILOMETER = 1000

const SecondaryText = styled.div`
  font-weight: normal;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.secondaryText};
`

const convertDistance = (distance, setting, t) => {
  if (setting === IMPERIAL) {
    const feet = Math.round(distance / METERS_IN_FOOT)
    if (feet < CONVERSION_THRESHOLD) {
      const count = parseFloat(feet.toPrecision(2))
      return count === 1
        ? t('pages.settings.units.distance.foot.one', { count })
        : t('pages.settings.units.distance.foot.other', { count })
    } else {
      const count = parseFloat((feet / FEET_IN_MILE).toPrecision(2))
      return count === 1
        ? t('pages.settings.units.distance.mile.one', { count })
        : t('pages.settings.units.distance.mile.other', { count })
    }
  } else {
    const meters = Math.round(distance)
    if (meters < CONVERSION_THRESHOLD) {
      const count = parseFloat(meters.toPrecision(2))
      return count === 1
        ? t('pages.settings.units.distance.meter.one', { count })
        : t('pages.settings.units.distance.meter.other', { count })
    } else {
      const count = parseFloat((meters / METERS_IN_KILOMETER).toPrecision(2))
      return count === 1
        ? t('pages.settings.units.distance.kilometer.one', { count })
        : t('pages.settings.units.distance.kilometer.other', { count })
    }
  }
}

const DistanceText = ({ distance }) => {
  const { t } = useTranslation()
  const distanceUnit = useSelector((state) => state.settings.distanceUnit)

  return (
    <SecondaryText>{convertDistance(distance, distanceUnit, t)}</SecondaryText>
  )
}

export default DistanceText
