import { useHistory } from 'react-router-dom'
import InfiniteLoader from 'react-window-infinite-loader'

import EntryList from './EntryList'

const InfiniteList = ({
  locations,
  loadNextPage,
  hasMoreItems,
  isNextPageLoading,
  height,
  width,
}) => {
  const history = useHistory()

  const itemCount = hasMoreItems ? locations.length + 1 : locations.length

  // eslint-disable-next-line no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => !hasMoreItems || index < locations.length

  const handleListEntryClick = (id) => {
    history.push({
      pathname: `/list/entry/${id}`,
      state: { fromPage: '/list' },
    })
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <EntryList
          height={height}
          width={width}
          itemSize={57}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          locations={locations}
          handleListEntryClick={handleListEntryClick}
          isNextPageLoading={isNextPageLoading}
        />
      )}
    </InfiniteLoader>
  )
}

export default InfiniteList
