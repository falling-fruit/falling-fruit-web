import { ChevronRight, Pin } from '@styled-icons/boxicons-solid'
import { FixedSizeList } from 'react-window'

import CircleIcon from '../ui/CircleIcon'
import { theme } from '../ui/GlobalStyle'
import LoadingIndicator from '../ui/LoadingIndicator'
import ListEntry from './ListEntry'

const convertMetersToMiles = (meters) => {
  let miles = (meters * 0.000621371192).toString()
  miles = miles.slice(0, miles.indexOf('.') + 3)
  return miles
}

const EntryList = ({
  height,
  width,
  itemSize,
  itemCount,
  locations,
  handleListEntryClick,
  ...props
}) => {
  const renderRow = ({ index, style }) => {
    const location = locations[index]
    let row = null
    if (location) {
      row = (
        <ListEntry
          key={location.id}
          leftIcons={
            <CircleIcon>
              {location.photo ? (
                <img src={location.photo.medium} alt="entry-icon" />
              ) : (
                <Pin />
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
      {...props}
    >
      {renderRow}
    </FixedSizeList>
  )
}

export default EntryList
