import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import {
  fetchListLocationsExtend,
  fetchListLocationsStart,
} from '../../redux/listSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import Spinner from '../ui/Spinner'
import { NoResultsFound, ShouldZoomIn } from './ListLoading'
import Locations from './Locations'

// Allow space for 80px search bar and 8px border
const ListPageWrapper = styled.div`
  margin-top: 88px;
  overflow: scroll;
`

const ListPage = () => {
  const dispatch = useDispatch()
  const {
    totalCount: totalLocations,
    locations,
    isLoading: isNextPageLoading,
    shouldFetchNewLocations: locationsInvalid,
  } = useSelector((state) => state.list)
  const history = useAppHistory()
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
  } else if (locations.length === 0) {
    inner = <div />
  } else {
    inner = (
      <Locations
        itemCount={totalLocations}
        locations={locations}
        loadNextPage={() => {
          if (!isNextPageLoading) {
            dispatch(fetchListLocationsExtend(locations))
          }
        }}
        isNextPageLoading={isNextPageLoading}
        onLocationClick={(locationId) => {
          history.push(`/list-locations/${locationId}`)
        }}
      />
    )
  }

  return <ListPageWrapper>{inner}</ListPageWrapper>
}

export default ListPage
