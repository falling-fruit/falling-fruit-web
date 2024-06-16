import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components/macro'

import {
  clusterClick,
  restoreOldView,
  zoomIn,
  zoomInAndSave,
  zoomOnLocationAndSave,
} from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { getAllLocations, viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useAppHistory } from '../../utils/useAppHistory'
import AddLocationButton from '../ui/AddLocationButton'
import LoadingIndicator from '../ui/LoadingIndicator'
import { ConnectedGeolocation } from './ConnectedGeolocation'
import Map from './Map'
import { AddLocationPin, EditLocationPin } from './Pins'
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
  const locationIdsByReviewId = useSelector(
    (state) => state.misc.locationIdsByReviewId,
  )
  let locationId, isAddingLocation, isViewingLocation, isEditingLocation
  if (locationRouteMatch) {
    locationId = parseInt(locationRouteMatch.params.locationId)
    isAddingLocation = locationRouteMatch.params.locationId === 'new'
    isViewingLocation =
      locationRouteMatch.params.nextSegment?.indexOf('@') === 0
    isEditingLocation = locationRouteMatch.params.nextSegment === 'edit'
  } else if (reviewRouteMatch) {
    const reviewId = parseInt(reviewRouteMatch.params.reviewId)
    locationId = locationIdsByReviewId[reviewId]
    isAddingLocation = false
    isViewingLocation = true
    isEditingLocation = false
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

  const selectedLocations = allLocations.filter((x) => x.id === locationId)
  const locationBeingEdited =
    isEditingLocation && selectedLocations.length
      ? selectedLocations[0]
      : undefined
  const latOfLocationBeingEdited = locationBeingEdited?.lat
  const lngOfLocationBeingEdited = locationBeingEdited?.lng
  useEffect(() => {
    if (isAddingLocation) {
      dispatch(zoomInAndSave())
    } else {
      dispatch(restoreOldView())
    }
  }, [dispatch, isAddingLocation])
  // Unpack lat and lng so useEffect can compare on value equality
  // ( after moving the map, locationBeingEdited might be an equivalent but different object)
  // These are only available if the location being edited is on the screen
  // Adding the if(lat...) makes the jump not happen once we scroll off the map
  // but there is still a small problem: loading the map away from the center and then scrolling in produces a jump
  // Ideally we would only like to zoom on location after clicking "edit location"
  useEffect(() => {
    if (isEditingLocation) {
      if (latOfLocationBeingEdited && lngOfLocationBeingEdited) {
        dispatch(
          zoomOnLocationAndSave({
            lat: latOfLocationBeingEdited,
            lng: lngOfLocationBeingEdited,
          }),
        )
      }
    } else {
      dispatch(restoreOldView())
    }
  }, [
    dispatch,
    isEditingLocation,
    latOfLocationBeingEdited,
    lngOfLocationBeingEdited,
  ])

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
      {isEditingLocation && <EditLocationPin />}
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
        editingLocationId={isEditingLocation ? locationId : null}
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
        showLabels={
          settings.showLabels || isAddingLocation || isEditingLocation
        }
        showStreetView={streetView}
        showBusinesses={settings.showBusinesses}
      />
    </div>
  )
}

export default MapPage
