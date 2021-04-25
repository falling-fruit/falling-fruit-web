import { useHistory } from 'react-router-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'

import FixedSizeList from './FixedSizeList'

const InfiniteList = ({
  locations,
  loadNextPage,
  hasMoreItems,
  isNextPageLoading,
}) => {
  const history = useHistory()

  const itemCount = hasMoreItems ? locations.length + 1 : locations.length

  // eslint-disable-next-line no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => !hasMoreItems || index < locations.length

  const handleListEntryClick = (id) => {
    history.push({
      pathname: `/entry/${id}`,
      state: { fromPage: '/map' },
    })
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={57}
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
              ref={ref}
              locations={locations}
              handleListEntryClick={handleListEntryClick}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  )
}

export default InfiniteList
