import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'

import FixedSizeList from './FixedSizeList'

const InfiniteList = ({
  locations,
  loadNextPage,
  hasMoreItems,
  isNextPageLoading,
}) => {
  const itemCount = hasMoreItems ? locations.length + 1 : locations.length

  // eslint-disable-next-line no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => !hasMoreItems || index < locations.length

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
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  )
}

export default InfiniteList
