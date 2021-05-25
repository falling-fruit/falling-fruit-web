import { ChevronRight } from '@styled-icons/boxicons-solid'
import { darken } from 'polished'
import { forwardRef } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'
import LoadingIndicator from '../ui/LoadingIndicator'
import { TypeName } from '../ui/TypeName'
import { ReactComponent as LeafIcon } from './leaf.svg'

const convertMetersToMiles = (meters) => (meters * 0.000621371192).toFixed(2)

const StyledListEntry = styled(ListEntry)`
  cursor: pointer;

  @media ${({ theme }) => theme.device.desktop} {
    :hover {
      background-color: ${({ theme }) => darken(0.05, theme.background)};
    }
  }
`

// TODO: skeleton for unloaded rows and allow arbitrarily scrolling down.
// See http://bvaughn.github.io/react-virtualized/#/components/InfiniteLoader

const EntryList = forwardRef(
  (
    { locations, onEntryClick, onEntryMouseEnter, onEntryMouseLeave, ...props },
    ref,
  ) => {
    const renderRow = ({ index, style }) => {
      const location = locations[index]

      let row
      if (location) {
        row = (
          <StyledListEntry
            key={location.id}
            leftIcons={
              <CircleIcon backgroundColor={theme.green}>
                {/* TODO: locations currently don't have a photo tied to them, so never shows up */}
                {location.photo ? (
                  <img src={location.photo.thumb} alt="entry-icon" />
                ) : (
                  <LeafIcon />
                )}
              </CircleIcon>
            }
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={<TypeName typeId={location.type_ids[0]} />}
            secondaryText={`${convertMetersToMiles(location.distance)} miles`}
            onClick={(e) => onEntryClick?.(location.id, e)}
            onMouseEnter={(e) => onEntryMouseEnter?.(location.id, e)}
            onMouseLeave={(e) => onEntryMouseLeave?.(location.id, e)}
            style={style}
          />
        )
      } else {
        row = (
          <StyledListEntry secondaryText={<LoadingIndicator />} style={style} />
        )
      }

      return row
    }

    return (
      <FixedSizeList ref={ref} {...props}>
        {renderRow}
      </FixedSizeList>
    )
  },
)
EntryList.displayName = 'EntryList'

export default EntryList
