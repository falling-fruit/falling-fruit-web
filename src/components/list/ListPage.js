import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import {
  fetchListLocationsExtend,
  fetchListLocationsStart,
} from '../../redux/listSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import Spinner from '../ui/Spinner'
import { NoResultsFound, ShouldZoomIn } from './ListLoading'
import Locations from './Locations'

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

  if (!locationsAvailable) {
    return <Spinner />
  }

  if (lastMapView.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
    return <ShouldZoomIn />
  }

  if (locations.length === 0 && !isNextPageLoading && !locationsInvalid) {
    return <NoResultsFound />
  }

  if (locations.length === 0) {
    return <div />
  }
  return (
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

export default ListPage
