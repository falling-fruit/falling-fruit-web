import { ChevronRight } from '@styled-icons/boxicons-solid'
import { forwardRef } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'
import LoadingIndicator from '../ui/LoadingIndicator'
import { ReactComponent as LeafIcon } from './leaf.svg'

const convertMetersToMiles = (meters) => (meters * 0.000621371192).toFixed(2)

const StyledListEntry = styled(ListEntry)`
  cursor: pointer;
`

const EntryList = forwardRef(
  (
    {
      height,
      width,
      itemSize,
      itemCount,
      locations,
      handleListEntryClick,
      ...props
    },
    ref,
  ) => {
    const renderRow = ({ index, style }) => {
      const location = locations[index]
      let row = null
      if (location) {
        row = (
          <StyledListEntry
            key={location.id}
            leftIcons={
              <CircleIcon backgroundColor={theme.green}>
                {/* TODO: locations currently don't have a photo tied to them, so never shows up */}
                {location.photo ? (
                  <img src={location.photo.medium} alt="entry-icon" />
                ) : (
                  <LeafIcon />
                )}
              </CircleIcon>
            }
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={location.type_names[0]}
            secondaryText={`${convertMetersToMiles(location.distance)} miles`}
            onClick={() => handleListEntryClick(location.id)}
            style={style}
          />
        )
      } else if (index < itemCount) {
        row = (
          <div style={style}>
            <LoadingIndicator />
          </div>
        )
      }
      return row
    }

    return (
      <FixedSizeList
        height={height}
        width={width}
        itemSize={itemSize}
        itemCount={itemCount}
        ref={ref}
        {...props}
      >
        {renderRow}
      </FixedSizeList>
    )
  },
)
EntryList.displayName = 'EntryList'

export default EntryList
