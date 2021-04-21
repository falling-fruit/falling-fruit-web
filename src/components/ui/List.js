import { ChevronRight, Star } from '@styled-icons/boxicons-solid'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'

const convertMetersToMiles = (meters) => {
  let miles = (meters * 0.000621371192).toString()
  miles = miles.slice(0, miles.indexOf('.') + 3)
  return miles
}

const List = ({ locations, handleListEntryClick }) => {
  const renderRow = ({ index }) => {
    const location = locations[index]
    return (
      <ListEntry
        key={location.id}
        leftIcons={<Star size="16" />}
        rightIcons={<ChevronRight size="16" color={theme.blue} />}
        primaryText={location.type_names[0]}
        secondaryText={`${convertMetersToMiles(location.distance)} miles`}
        onClick={() => handleListEntryClick(location.id)}
      />
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemSize={50}
          itemCount={locations.length}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}

export default List
