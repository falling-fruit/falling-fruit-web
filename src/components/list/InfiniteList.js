import { useHistory } from 'react-router-dom'
import InfiniteLoader from 'react-window-infinite-loader'

import EntryList from './EntryList'

const InfiniteList = ({
  itemCount,
  locations,
  loadNextPage,
  hasMoreItems,
  isNextPageLoading,
  height,
  width,
}) => {
  const history = useHistory()

  // eslint-disable-next-line no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => !hasMoreItems || index < locations.length

  const handleEntryClick = (id) => {
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
          onEntryClick={handleEntryClick}
        />
      )}
    </InfiniteLoader>
  )
}

export default InfiniteList
