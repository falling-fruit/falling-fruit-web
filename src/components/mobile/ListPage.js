import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import {
  fetchListLocationsExtend,
  fetchListLocationsStart,
} from '../../redux/listSlice'
import InfiniteList from '../list/InfiniteList'
import { NoResultsFound, ShouldZoomIn } from '../list/ListLoading'
import Spinner from '../ui/Spinner'

const ListPageWrapper = styled.div`
  margin-top: 85px;
`

const ListPage = () => {
  const dispatch = useDispatch()
  const {
    totalCount: totalLocations,
    locations,
    isLoading: isNextPageLoading,
    shouldFetchNewLocations: locationsInvalid,
  } = useSelector((state) => state.list)
  const { typesAccess } = useSelector((state) => state.type)
  const { lastMapView } = useSelector((state) => state.viewport)
  const locationsAvailable = !(typesAccess.isEmpty || lastMapView === null)

  useEffect(() => {
    if (locationsAvailable && locationsInvalid) {
      dispatch(fetchListLocationsStart())
    }
  }, [dispatch, locationsAvailable, locationsInvalid])

  let inner

  if (!locationsAvailable) {
    inner = <Spinner />
  } else if (lastMapView.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
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
