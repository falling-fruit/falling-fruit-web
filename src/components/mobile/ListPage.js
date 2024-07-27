import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components/macro'

import {
  fetchListLocationsExtend,
  fetchListLocationsStart,
} from '../../redux/listSlice'
import { getIsShowingClusters } from '../../redux/viewChange'
import InfiniteList from '../list/InfiniteList'
import { NoResultsFound, ShouldZoomIn } from '../list/ListLoading'

const ListPageWrapper = styled.div`
  margin-top: 85px;
`

const ListPage = () => {
  const { pathname } = useLocation()

  const dispatch = useDispatch()
  const {
    totalCount: totalLocations,
    locations,
    isLoading: isNextPageLoading,
    shouldFetchNewLocations: locationsInvalid,
  } = useSelector((state) => state.list)
  const { googleMap } = useSelector((state) => state.map)
  const isShowingClusters = useSelector(getIsShowingClusters)

  useEffect(() => {
    if (pathname.startsWith('/list') && googleMap && locationsInvalid) {
      dispatch(fetchListLocationsStart())
    }
  }, [pathname]) //eslint-disable-line

  let inner

  if (isShowingClusters) {
    inner = <ShouldZoomIn />
  } else if (
    locations.length === 0 &&
    !isNextPageLoading &&
    !locationsInvalid
  ) {
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
            loadNextPage={() => {
              dispatch(fetchListLocationsExtend(locations))
            }}
            isNextPageLoading={isNextPageLoading}
          />
        )}
      </AutoSizer>
    )
  }

  return <ListPageWrapper>{inner}</ListPageWrapper>
}

export default ListPage
