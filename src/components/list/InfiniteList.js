import { ChevronRight } from '@styled-icons/boxicons-solid'
import { useHistory } from 'react-router-dom'
import InfiniteLoader from 'react-window-infinite-loader'

import { theme } from '../ui/GlobalStyle'
import FixedSizeList from './FixedSizeList'

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
        <FixedSizeList
          height={height}
          width={width}
          itemSize={57}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          locations={locations}
          handleListEntryClick={handleListEntryClick}
          rightIcons={<ChevronRight size="16" color={theme.blue} />}
        />
      )}
    </InfiniteLoader>
  )
}

export default InfiniteList
