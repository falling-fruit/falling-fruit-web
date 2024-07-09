import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import { clusterClick, zoomIn } from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { viewChangeAndFetch } from '../../redux/viewChange'
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
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()

  const {
    locationId,
    position,
    isLoading: locationIsLoading,
    isBeingEdited: isEditingLocation,
    location: selectedLocation,
  } = useSelector((state) => state.location)
  const isAddingLocation = locationId === 'new'
  const isViewingLocation = locationId !== null && locationId !== 'new'

  const { getCommonName } = useTypesById()
  const settings = useSelector((state) => state.settings)
  const {
    locations,
    hoveredLocationId,
    geolocation,
    locationRequested,
    place,
    streetView,
    view,
    clusters,
  } = useSelector((state) => state.map)

  // TODO: find a way to update position after edit
  const allLocations =
    clusters.length !== 0
      ? []
      : selectedLocation
        ? [...locations, selectedLocation].filter(
            (loc, index, self) =>
              index === self.findIndex((t) => t.id === loc.id),
          )
        : locations

  const handleLocationClick =
    isAddingLocation || isEditingLocation
      ? undefined
      : (location) => {
          history.push({
            pathname: `/locations/${location.id}`,
            state: { fromPage: '/map' },
          })
        }
  const handleClusterClick =
    isAddingLocation || isEditingLocation
      ? undefined
      : (cluster) => dispatch(clusterClick(cluster))
  const stopViewingLocation = () => {
    if (isViewingLocation) {
      history.push('/map')
    }
  }

  const handleAddLocationClick = () => {
    if (view.zoom >= VISIBLE_CLUSTER_ZOOM_LIMIT) {
      history.push({
        pathname: '/locations/new',
        state: { fromPage: '/map' },
      })
    } else {
      toast.info(t('menu.zoom_in_to_add_location'))
    }
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
      {locationIsLoading && <BottomLeftLoadingIndicator />}
      {isAddingLocation && !isDesktop && <AddLocationCentralUnmovablePin />}
      {!locationId && !isDesktop && (
        <AddLocationButton onClick={handleAddLocationClick} />
      )}
      {isEditingLocation && !isDesktop && <EditLocationCentralUnmovablePin />}
      {!isDesktop && <TrackLocationButton isIcon />}

      {locationRequested && <ConnectedGeolocation />}

      {view && (
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
          position={
            (isEditingLocation || isAddingLocation) && isDesktop
              ? position
              : null
          }
          activeLocationId={locationId || hoveredLocationId}
          editingLocationId={
            (isEditingLocation || isAddingLocation) && !locationIsLoading
              ? locationId
              : null
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
          showLabels={
            settings.showLabels || isEditingLocation || isAddingLocation
          }
          showStreetView={streetView}
          showBusinesses={settings.showBusinesses}
        />
      )}
    </div>
  )
}

export default MapPage
