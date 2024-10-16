import { ChevronRight } from '@styled-icons/boxicons-solid'
import { darken } from 'polished'
import { forwardRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry, { PrimaryText, SecondaryText } from '../ui/ListEntry'
import { TypeName } from '../ui/TypeName'
import { ReactComponent as LeafIcon } from './leaf.svg'

const METERS_IN_FOOT = 0.3048
const FEET_IN_MILE = 5280
const CONVERSION_THRESHOLD = 1000
const METERS_IN_KILOMETER = 1000
const IMPERIAL = 'imperial'

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
    const { typesAccess } = useSelector((state) => state.type)
    const Item = ({ index, style }) => {
      const location = locations[index]

      let content
      if (location) {
        const type = typesAccess.getType(location.type_ids[0])
        content = (
          <StyledListEntry
            key={location.id}
            leftIcons={<EntryIcon imageSrc={location.photo} />}
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            onClick={(e) => onEntryClick?.(location.id, e)}
            onMouseEnter={(e) => onEntryMouseEnter?.(location.id, e)}
            onMouseLeave={(e) => onEntryMouseLeave?.(location.id, e)}
            style={style}
          >
            <PrimaryText>
              <TypeName
                commonName={type?.commonName}
                scientificName={type?.scientificName}
              />
            </PrimaryText>
            <SecondaryText>
              {convertDistance(location.distance, distanceUnit)}
            </SecondaryText>
          </StyledListEntry>
        )
      } else {
        // Row not yet loaded
        content = (
          <StyledListEntry
            leftIcons={<Skeleton circle width="1.75rem" height="1.75rem" />}
            rightIcons={<ChevronRight size="16" color={theme.tertiaryText} />}
            style={style}
          >
            <PrimaryText>
              <Skeleton width={150} />
            </PrimaryText>
            <SecondaryText>
              <Skeleton width={50} />
            </SecondaryText>
          </StyledListEntry>
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
