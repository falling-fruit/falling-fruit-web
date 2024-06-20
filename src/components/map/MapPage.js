import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import { clusterClick, zoomIn, zoomInAndSave } from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { getAllLocations, viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useAppHistory } from '../../utils/useAppHistory'
import AddLocationButton from '../ui/AddLocationButton'
import AddLocationPin from '../ui/AddLocationPin'
import LoadingIndicator from '../ui/LoadingIndicator'
import { ConnectedGeolocation } from './ConnectedGeolocation'
import Map from './Map'
import TrackLocationButton from './TrackLocationButton'

const BottomLeftLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
  left: 10px;
  bottom: 10px;
`

const MapPage = ({ isDesktop }) => {
  const history = useAppHistory()
  const locationRouteMatch = useRouteMatch({
    path: ['/locations/:locationId/:nextSegment', '/locations/:locationId'],
  })
  const reviewRouteMatch = useRouteMatch({
    path: '/reviews/:reviewId/edit',
  })
  const { review } = useSelector((state) => state.review)

  let locationId, isAddingLocation, isViewingLocation
  if (locationRouteMatch) {
    locationId = parseInt(locationRouteMatch.params.locationId)
    isAddingLocation = locationRouteMatch.params.locationId === 'new'
    isViewingLocation =
      locationRouteMatch.params.nextSegment?.indexOf('@') === 0
  } else if (reviewRouteMatch && review) {
    locationId = review.location_id
    isAddingLocation = false
    isViewingLocation = true
  }

  const { getCommonName } = useTypesById()
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)
  const allLocations = useSelector(getAllLocations)
  const isLoading = useSelector((state) => state.map.isLoading)
  const hoveredLocationId = useSelector((state) => state.map.hoveredLocationId)
  const geolocation = useSelector((state) => state.map.geolocation)
  const locationRequested = useSelector((state) => state.map.locationRequested)
  const place = useSelector((state) => state.map.place)
  const streetView = useSelector((state) => state.map.streetView)
  const view = useSelector((state) => state.map.view)
  const clusters = useSelector((state) => state.map.clusters)

  useEffect(() => {
    if (isAddingLocation) {
      dispatch(zoomInAndSave())
    }
  }, [dispatch, isAddingLocation])

  const handleLocationClick = isAddingLocation
    ? undefined
    : (location) => {
        history.push({
          pathname: `/locations/${location.id}`,
          state: { fromPage: '/map' },
        })
      }
  const handleClusterClick = isAddingLocation
    ? undefined
    : (cluster) => dispatch(clusterClick(cluster))
  const stopViewingLocation = () => {
    if (isViewingLocation) {
      history.push('/map')
    }
  }

  const handleAddLocationClick = () => {
    history.push('/locations/new')
  }

  return (
    <div
      // TODO: Use constants for mobile top and bottom position
      style={
        isDesktop
          ? { width: '100%', height: '100%', position: 'relative' }
          : { width: '100%', position: 'fixed', bottom: '50px', top: '63px' }
      }
    >
      {isLoading && <BottomLeftLoadingIndicator />}
      {isAddingLocation ? (
        <AddLocationPin />
      ) : (
        !isDesktop && <AddLocationButton onClick={handleAddLocationClick} />
      )}
      {!isDesktop && <TrackLocationButton isIcon />}

      {locationRequested && <ConnectedGeolocation />}

      <Map
        bootstrapURLKeys={bootstrapURLKeys}
        view={view}
        geolocation={geolocation}
        clusters={clusters}
        locations={allLocations.map((location) => ({
          ...location,
          typeName: getCommonName(location.type_ids[0]),
        }))}
        place={place}
        activeLocationId={locationId || hoveredLocationId}
        onViewChange={(newView) => {
          dispatch(viewChangeAndFetch(newView))
        }}
        onGeolocationClick={() => {
          dispatch(
            zoomIn({ lat: geolocation.latitude, lng: geolocation.longitude }),
          )
        }}
        onLocationClick={handleLocationClick}
        onClusterClick={handleClusterClick}
        onNonspecificClick={() => dispatch(stopViewingLocation)}
        mapType={settings.mapType}
        layerTypes={settings.mapLayers}
        showLabels={settings.showLabels || isAddingLocation}
        showStreetView={streetView}
        showBusinesses={settings.showBusinesses}
      />
    </div>
  )
}

export default MapPage
