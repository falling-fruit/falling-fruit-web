import { ChevronRight, Star } from '@styled-icons/boxicons-solid'
import { useHistory } from 'react-router-dom'
import { FixedSizeList as List } from 'react-window'

import { theme } from '../ui/GlobalStyle'
import ListEntry from './ListEntry'

const convertMetersToMiles = (meters) => {
  let miles = (meters * 0.000621371192).toString()
  miles = miles.slice(0, miles.indexOf('.') + 3)
  return miles
}

const FixedSizeList = ({
  height,
  width,
  itemSize,
  itemCount,
  locations,
  ...props
}) => {
  const history = useHistory()

  const handleListEntryClick = (id) => {
    history.push({
      pathname: `/entry/${id}`,
      state: { fromPage: '/map' },
    })
  }

  const renderRow = ({ index, style }) => {
    const location = locations[index]
    return location ? (
      <ListEntry
        height={itemSize}
        key={location.id}
        leftIcons={<Star size="16" />}
        rightIcons={<ChevronRight size="16" color={theme.blue} />}
        primaryText={location.type_names[0]}
        secondaryText={`${convertMetersToMiles(location.distance)} miles`}
        onClick={() => handleListEntryClick(location.id)}
        style={style}
      />
    ) : null
  }

  return (
    <List
      height={height}
      width={width}
      itemSize={itemSize}
      itemCount={itemCount}
      {...props}
    >
      {renderRow}
    </List>
  )
}

export default FixedSizeList
