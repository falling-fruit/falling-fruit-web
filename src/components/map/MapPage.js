import GoogleMapReact from 'google-map-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'

import {
  MIN_GEOLOCATION_ZOOM,
  VISIBLE_CLUSTER_ZOOM_LIMIT,
} from '../../constants/map'
import { fetchFilterCounts } from '../../redux/filterSlice'
import { updatePosition } from '../../redux/locationSlice'
import { setGoogle } from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { fetchLocations, viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useAppHistory } from '../../utils/useAppHistory'
import AddLocationButton from '../ui/AddLocationButton'
import LoadingIndicator from '../ui/LoadingIndicator'
import CloseStreetView from './CloseStreetView'
import Cluster from './Cluster'
import { ConnectGeolocation, isGeolocationOpen } from './ConnectGeolocation'
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

const ZoomButton = styled.button`
  position: absolute;
  left: 10px;
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  z-index: 1;
`

const ZoomInButton = styled(ZoomButton)`
  top: calc(50% - 45px);
`

const ZoomOutButton = styled(ZoomButton)`
  top: calc(50% + 5px);
`

const MapPage = ({ isDesktop }) => {
  const { t } = useTranslation()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const { getCommonName } = useTypesById()

  const [draggedPosition, setDraggedPosition] = useState(null)

  const {
    initialView,
    locations,
    clusters,
    isLoading: mapIsLoading,
    googleMap,
    getGoogleMaps,
  } = useSelector((state) => state.map)

  const currentZoom = googleMap?.getZoom()

  const place = useSelector((state) => state.place.selectedPlace?.location)

  const { geolocation, geolocationState } = useSelector(
    (state) => state.geolocation,
  )
  const {
    locationId,
    position,
    isBeingEdited: isEditingLocation,
    location: selectedLocation,
    isLoading: locationIsLoading,
    streetViewOpen: showStreetView,
  } = useSelector((state) => state.location)
  const {
    mapType,
    mapLayers: layerTypes,
    showLabels: settingsShowLabels,
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

  const isAddingLocation = locationId === 'new'
  const isViewingLocation =
    locationId !== null && !isEditingLocation && !isAddingLocation
  const showLabels = settingsShowLabels || isAddingLocation || isEditingLocation

  useEffect(() => {
    setDraggedPosition(isDesktop ? position : null)
  }, [position, isDesktop])

  const apiIsLoaded = (map, maps) => {
    /*
     * Something breaks when storing maps in redux so pass a reference to it
     */
    dispatch(setGoogle({ googleMap: map, getGoogleMaps: () => maps }))
    dispatch(fetchLocations())
    dispatch(fetchFilterCounts())
  }

  const handleClusterClick = (cluster) => {
    googleMap?.panTo({ lat: cluster.lat, lng: cluster.lng })
    googleMap?.setZoom(
      cluster.count === 1
        ? VISIBLE_CLUSTER_ZOOM_LIMIT + 1
        : Math.min(VISIBLE_CLUSTER_ZOOM_LIMIT + 1, currentZoom + 3),
    )
  }

  const handleGeolocationClick = () => {
    googleMap?.panTo({
      lat: geolocation.latitude,
      lng: geolocation.longitude,
    })
    if (currentZoom < MIN_GEOLOCATION_ZOOM) {
      googleMap?.setZoom(MIN_GEOLOCATION_ZOOM)
    }
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
    if (currentZoom >= VISIBLE_CLUSTER_ZOOM_LIMIT) {
      history.push({
        pathname: '/locations/new',
        state: { fromPage: '/map' },
      })
    } else {
      toast.info(t('menu.zoom_in_to_add_location'))
    }
  }

  const zoomIn = () => {
    googleMap?.setZoom(currentZoom + 1)
  }
  const zoomOut = () => {
    googleMap?.setZoom(currentZoom - 1)
  }
  return (
    <div
      style={
        isDesktop
          ? { width: '100%', height: '100%', position: 'relative' }
          : { width: '100%', position: 'fixed', bottom: '50px', top: '63px' }
      }
    >
      {(mapIsLoading || locationIsLoading) && <BottomLeftLoadingIndicator />}
      {isAddingLocation && !isDesktop && <AddLocationCentralUnmovablePin />}
      {!locationId && !isDesktop && (
        <AddLocationButton onClick={handleAddLocationClick} />
      )}
      {isEditingLocation && !isDesktop && <EditLocationCentralUnmovablePin />}
      {!isDesktop && <TrackLocationButton isIcon />}

      <ZoomInButton
        onClick={zoomIn}
        disabled={!currentZoom || currentZoom >= 22}
      >
        +
      </ZoomInButton>
      <ZoomOutButton
        onClick={zoomOut}
        disabled={!currentZoom || currentZoom <= 4}
      >
        -
      </ZoomOutButton>

      {isGeolocationOpen(geolocationState) && <ConnectGeolocation />}

      {googleMap && <PanoramaHandler />}
      {showStreetView && <CloseStreetView />}
      {initialView && (
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
          defaultCenter={initialView.center}
          defaultZoom={initialView.zoom}
          onChange={(_) => {
            // the argument is supposed to be a view
            // but does not reliably work when bounds change
            if (googleMap) {
              const center = googleMap.getCenter()
              const newView = {
                center: { lat: center.lat(), lng: center.lng() },
                zoom: googleMap.getZoom(),
                bounds: googleMap.getBounds().toJSON(),
              }
              dispatch(viewChangeAndFetch(newView))
              history.changeView(newView)
            }
          }}
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
                isEditingLocation || isAddingLocation
                  ? null
                  : (event) => {
                      handleLocationClick(location)
                      event.stopPropagation()
                    }
              }
              lat={location.lat}
              lng={location.lng}
              selected={location.id === locationId}
              editing={isEditingLocation && location.id === locationId}
              label={
                showLabels ? getCommonName(location.type_ids[0]) : undefined
              }
            />
          ))}
          {(isEditingLocation || isAddingLocation) && draggedPosition && (
            <DraggableMapPin
              lat={draggedPosition.lat}
              lng={draggedPosition.lng}
              // confusingly it doesn't work from inside the component
              $geoService={getGoogleMaps && getGoogleMaps().Geocoder}
              onChange={setDraggedPosition}
              onDragEnd={(newPosition) => dispatch(updatePosition(newPosition))}
            />
          )}
        </GoogleMapReact>
      )}
    </div>
  )
}

export default MapPage
