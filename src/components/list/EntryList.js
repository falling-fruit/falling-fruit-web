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

const convertDistance = (distance, setting) => {
  if (setting === 'imperial') {
    return `${(distance * 0.000621371192).toFixed(2)} miles`
  } else {
    if (distance >= 1000) {
      return `${(distance / 1000.0).toFixed(3)} kilometers`
    } else {
      return `${~~distance} meters`
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
    const settings = useSelector((state) => state.settings)
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
            secondaryText={`${convertDistance(
              location.distance,
              settings.distanceUnit,
            )}`}
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
