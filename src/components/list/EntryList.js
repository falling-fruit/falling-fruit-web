import { ChevronRight } from '@styled-icons/boxicons-solid'
import { darken } from 'polished'
import { forwardRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'
import { TypeName } from '../ui/TypeName'
import { ReactComponent as LeafIcon } from './leaf.svg'

const METERS_TO_FEET = 0.3048
const FEET_TO_MILES = 5280
const CONVERSION_THRESHOLD = 1000
const METERS_TO_KILOMETERS = 1000

const convertDistance = (distance, setting) => {
  if (setting === 'imperial') {
    const feet = Math.round(distance / METERS_TO_FEET)
    if (feet < CONVERSION_THRESHOLD) {
      return `${parseFloat(feet.toPrecision(2))} feet`
    } else {
      return `${parseFloat((feet / FEET_TO_MILES).toPrecision(2))} miles`
    }
  } else {
    const meters = Math.round(distance)
    if (meters < CONVERSION_THRESHOLD) {
      return `${parseFloat(meters.toPrecision(2))} meters`
    } else {
      return `${parseFloat(
        (meters / METERS_TO_KILOMETERS).toPrecision(2),
      )} kilometers`
    }
  }
}

const StyledListEntry = styled(ListEntry)`
  cursor: pointer;

  @media ${({ theme }) => theme.device.desktop} {
    :hover {
      background-color: ${({ theme }) => darken(0.05, theme.background)};
    }
  }
`

const EntryIcon = ({ imageSrc }) => (
  <CircleIcon backgroundColor={theme.green}>
    {imageSrc ? <img src={imageSrc} alt="entry-icon" /> : <LeafIcon />}
  </CircleIcon>
)

const EntryList = forwardRef(
  (
    { locations, onEntryClick, onEntryMouseEnter, onEntryMouseLeave, ...props },
    ref,
  ) => {
    const distanceUnit = useSelector((state) => state.settings.distanceUnit)
    const Item = ({ index, style }) => {
      const location = locations[index]

      let content
      if (location) {
        content = (
          <StyledListEntry
            key={location.id}
            // TODO: locations currently don't have a photo tied to them, so never shows up
            leftIcons={<EntryIcon imageSrc={location.photo?.thumb} />}
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={<TypeName typeId={location.type_ids[0]} />}
            secondaryText={convertDistance(location.distance, distanceUnit)}
            onClick={(e) => onEntryClick?.(location.id, e)}
            onMouseEnter={(e) => onEntryMouseEnter?.(location.id, e)}
            onMouseLeave={(e) => onEntryMouseLeave?.(location.id, e)}
            style={style}
          />
        )
      } else {
        // Row not yet loaded
        content = (
          <StyledListEntry
            leftIcons={<Skeleton circle width="1.75rem" height="1.75rem" />}
            rightIcons={<ChevronRight size="16" color={theme.tertiaryText} />}
            primaryText={<Skeleton width={150} />}
            secondaryText={<Skeleton width={50} />}
            style={style}
          />
        )
      }

      return content
    }

    return (
      <FixedSizeList ref={ref} {...props}>
        {Item}
      </FixedSizeList>
    )
  },
)
EntryList.displayName = 'EntryList'

export default EntryList
