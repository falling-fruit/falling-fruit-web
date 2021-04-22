import { ChevronRight, Star } from '@styled-icons/boxicons-solid'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'
import ListEntry from '../ui/ListEntry'

const convertMetersToMiles = (meters) => {
  let miles = (meters * 0.000621371192).toString()
  miles = miles.slice(0, miles.indexOf('.') + 3)
  return miles
}

const StyledRow = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const List = ({
  locations,
  handleListEntryClick,
  loadNextPage,
  hasMoreItems,
  isNextPageLoading,
}) => {
  const itemCount = hasMoreItems ? locations.length + 1 : locations.length

  // eslint-disable-next-line no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => !hasMoreItems || index < locations.length

  const renderRow = ({ index, style }) => {
    let row
    if (!isItemLoaded(index)) {
      row = <ListEntry primaryText="Loading..." />
    } else {
      const location = locations[index]
      row = (
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
    return <StyledRow style={style}>{row}</StyledRow>
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={57}
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {renderRow}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  )
}

export default List
