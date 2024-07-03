import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import {
  AddLocationCentralUnmovablePin,
  EditLocationCentralUnmovablePin,
} from './Pins'
import TrackLocationButton from './TrackLocationButton'

const BottomLeftLoadingIndicator = styled(LoadingIndicator)`
  position: absolute;
  left: 10px;
  bottom: 10px;
`

const MapPage = ({ isDesktop }) => {
  const history = useAppHistory()
  const dispatch = useDispatch()

  const {
    locationId,
    position,
    isLoading: locationIsLoading,
    isBeingEdited: isEditingLocation,
  } = useSelector((state) => state.location)
  const isAddingLocation = locationId === 'new'
  const isViewingLocation = locationId !== null && locationId !== 'new'

  const { getCommonName } = useTypesById()
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

  const latOfLocationBeingEdited = position?.lat
  const lngOfLocationBeingEdited = position?.lng
  useEffect(() => {
    if (isAddingLocation) {
      dispatch(zoomInAndSave())
    }
  }, [dispatch, isAddingLocation])
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
  }, [dispatch, isEditingLocation]) // eslint-disable-line

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
      {isAddingLocation && !isDesktop && <AddLocationCentralUnmovablePin />}
      {!locationId && !isDesktop && (
        <AddLocationButton onClick={handleAddLocationClick} />
      )}
      {isEditingLocation && !isAddingLocation && !isDesktop && (
        <EditLocationCentralUnmovablePin />
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
        position={isEditingLocation && isDesktop ? position : null}
        activeLocationId={locationId || hoveredLocationId}
        editingLocationId={
          isEditingLocation && !locationIsLoading ? locationId : null
        }
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
        showLabels={settings.showLabels || isEditingLocation}
        showStreetView={streetView}
        showBusinesses={settings.showBusinesses}
      />
    </div>
  )
}

export default MapPage
