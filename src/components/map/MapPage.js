import GoogleMapReact from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../../constants/map'
import { updatePosition } from '../../redux/locationSlice'
import { setStreetView } from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useAppHistory } from '../../utils/useAppHistory'
import AddLocationButton from '../ui/AddLocationButton'
import LoadingIndicator from '../ui/LoadingIndicator'
import CloseStreetView from './CloseStreetView'
import Cluster from './Cluster'
import { ConnectedGeolocation } from './ConnectedGeolocation'
import Geolocation from './Geolocation'
import Location from './Location'
import PanoramaHandler from './PanoramaHandler'
import {
  AddLocationCentralUnmovablePin,
  DraggableMapPin,
  EditLocationCentralUnmovablePin,
} from './Pins'
import Place from './Place'
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
  const { getCommonName } = useTypesById()

  const mapRef = useRef(null)
  const mapsRef = useRef(null)
  const [draggedPosition, setDraggedPosition] = useState(null)

  const {
    view,
    geolocation,
    place,
    locations,
    hoveredLocationId,
    clusters,
    streetView: showStreetView,
    locationRequested,
  } = useSelector((state) => state.map)
  const {
    locationId,
    position,
    isBeingEdited: isEditingLocation,
    location: selectedLocation,
    isLoading: locationIsLoading,
  } = useSelector((state) => state.location)
  const {
    mapType,
    mapLayers: layerTypes,
    showLabels,
    showBusinesses,
  } = useSelector((state) => state.settings)

  const allLocations =
    clusters.length !== 0
      ? []
      : selectedLocation
        ? [...locations, selectedLocation].filter(
            (loc, index, self) =>
              index === self.findIndex((t) => t.id === loc.id),
          )
        : locations

  const activeLocationId = locationId || hoveredLocationId
  const editingLocationId = isEditingLocation ? locationId : null
  const isAddingLocation = locationId === 'new'
  const isViewingLocation = locationId !== null && locationId !== 'new'

  useEffect(() => {
    setDraggedPosition(isDesktop ? position : null)
  }, [position, isDesktop])

  const apiIsLoaded = (map, maps) => {
    mapRef.current = map
    mapsRef.current = maps
  }

  const closeStreetView = (event) => {
    event.stopPropagation()
    dispatch(setStreetView(false))
  }

  const handleGeolocationClick = () => {
    dispatch(
      viewChangeAndFetch({
        center: { lat: geolocation.latitude, lng: geolocation.longitude },
        zoom: Math.max(view.zoom, 15),
      }),
    )
  }

  const handleClusterClick = (cluster) => {
    dispatch(
      viewChangeAndFetch({
        center: { lat: cluster.lat, lng: cluster.lng },
        zoom: view.zoom + 1,
      }),
    )
  }

  const handleLocationClick = (location) => {
    if (!isAddingLocation && !isEditingLocation) {
      history.push({
        pathname: `/locations/${location.id}`,
        state: { fromPage: '/map' },
      })
    }
  }

  const handleNonspecificClick = ({ event }) => {
    event.stopPropagation()
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

      <PanoramaHandler
        mapRef={mapRef}
        mapsRef={mapsRef}
        showStreetView={showStreetView}
      />
      {showStreetView && <CloseStreetView onClick={closeStreetView} />}
      {view && (
        <GoogleMapReact
          onClick={handleNonspecificClick}
          bootstrapURLKeys={bootstrapURLKeys}
          options={() => ({
            mapTypeId: mapType,
            disableDefaultUI: true,
            tilt: 0,
            // Toggle all basemap icons
            // https://developers.google.com/maps/documentation/javascript/style-reference
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels.icon',
                stylers: [{ visibility: showBusinesses ? 'on' : 'off' }],
              },
              {
                featureType: 'landscape',
                elementType: 'labels.icon',
                stylers: [{ visibility: showBusinesses ? 'on' : 'off' }],
              },
            ],
          })}
          layerTypes={layerTypes}
          center={view.center}
          zoom={view.zoom}
          onChange={(newView) => dispatch(viewChangeAndFetch(newView))}
          resetBoundsOnResize
          onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
          yesIWantToUseGoogleMapApiInternals
        >
          {geolocation && !geolocation.loading && !geolocation.error && (
            <Geolocation
              onClick={handleGeolocationClick}
              lat={geolocation.latitude}
              lng={geolocation.longitude}
              heading={geolocation.heading}
            />
          )}
          {place && (
            <Place lat={place.lat} lng={place.lng} label={place.description} />
          )}
          {clusters.map((cluster) => (
            <Cluster
              key={JSON.stringify(cluster)}
              onClick={(event) => {
                handleClusterClick(cluster)
                event.stopPropagation()
              }}
              count={cluster.count}
              lat={cluster.lat}
              lng={cluster.lng}
            />
          ))}
          {allLocations.map((location) => (
            <Location
              key={location.id}
              onClick={
                handleLocationClick
                  ? (event) => {
                      handleLocationClick(location)
                      event.stopPropagation()
                    }
                  : undefined
              }
              lat={location.lat}
              lng={location.lng}
              selected={location.id === activeLocationId}
              editing={location.id === editingLocationId}
              label={
                showLabels ? getCommonName(location.type_ids[0]) : undefined
              }
            />
          ))}
          {draggedPosition && (
            <DraggableMapPin
              lat={draggedPosition.lat}
              lng={draggedPosition.lng}
              $geoService={mapsRef.current?.Geocoder}
              onChange={setDraggedPosition}
              onDragEnd={(newPosition) => dispatch(updatePosition(newPosition))}
              isNewLocation={editingLocationId === 'new'}
            />
          )}
        </GoogleMapReact>
      )}
    </div>
  )
}

export default MapPage
