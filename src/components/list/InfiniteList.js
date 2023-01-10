import InfiniteLoader from 'react-window-infinite-loader'

import { useAppHistory } from '../../utils/useAppHistory'
import EntryList from './EntryList'

const InfiniteList = ({
  itemCount,
  locations,
  loadNextPage,
  isNextPageLoading,
  height,
  width,
}) => {
  const history = useAppHistory()

  // eslint-disable-next-line no-empty-function
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

  const isItemLoaded = (index) => index < locations.length

  const handleEntryClick = (id) => {
    history.push({
      pathname: `/locations/${id}`,
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
