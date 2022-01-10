import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components/macro'

import { fetchListLocations } from '../../redux/listSlice'
import { getIsShowingClusters } from '../../redux/viewChange'
import InfiniteList from '../list/InfiniteList'
import { NoResultsFound, ShouldZoomIn } from '../list/ListLoading'

const ListPageWrapper = styled.div`
  margin-top: 85px;
`

const ListPage = () => {
  const { pathname } = useLocation()

  const dispatch = useDispatch()
  const totalLocations = useSelector((state) => state.list.totalCount)
  const locations = useSelector((state) => state.list.locations)
  const isNextPageLoading = useSelector((state) => state.list.isLoading)
  const isShowingClusters = useSelector(getIsShowingClusters)

  useEffect(() => {
    if (pathname.startsWith('/list')) {
      dispatch(fetchListLocations({ fetchCount: true, offset: 0 }))
    }
  }, [pathname, dispatch])

  let inner

  if (isShowingClusters) {
    inner = <ShouldZoomIn />
  } else if (locations.length === 0 && !isNextPageLoading) {
    inner = <NoResultsFound />
  } else {
    inner = (
      <AutoSizer>
        {({ width, height }) => (
          <InfiniteList
            itemCount={totalLocations}
            width={width}
            height={height}
            locations={locations}
            loadNextPage={() =>
              dispatch(
                fetchListLocations({ offset: locations.length, extend: true }),
              )
            }
            isNextPageLoading={isNextPageLoading}
          />
        )}
      </AutoSizer>
    )
  }

  return <ListPageWrapper>{inner}</ListPageWrapper>
}

export default ListPage
