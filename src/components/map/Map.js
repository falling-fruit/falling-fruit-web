import GoogleMapReact from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updatePosition } from '../../redux/locationSlice'
import { setStreetView } from '../../redux/mapSlice'
import { useTypesById } from '../../redux/useTypesById'
import { viewChangeAndFetch } from '../../redux/viewChange'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import CloseStreetView from './CloseStreetView'
import Cluster from './Cluster'
import Geolocation from './Geolocation'
import Location from './Location'
import PanoramaHandler from './PanoramaHandler'
import { DraggableMapPin } from './Pins'
import Place from './Place'

const Map = () => {
  const dispatch = useDispatch()
  const { getCommonName } = useTypesById()

  const {
    view,
    geolocation,
    place,
    locations,
    hoveredLocationId,
    clusters,
    streetView: showStreetView,
  } = useSelector((state) => state.map)
  const {
    locationId,
    position,
    isBeingEdited: isEditingLocation,
    location: selectedLocation,
  } = useSelector((state) => state.location)
  const {
    mapType,
    mapLayers: layerTypes,
    showLabels,
    showBusinesses,
  } = useSelector((state) => state.settings)

  //TODO not sure if selectedLocation is ever not in locations
  const allLocations =
    clusters.length !== 0
      ? []
      : selectedLocation
        ? [...locations, selectedLocation].filter(
            (loc, index, self) =>
              index === self.findIndex((t) => t.id === loc.id),
          )
        : locations

  const history = useAppHistory()
  const activeLocationId = locationId || hoveredLocationId
  const editingLocationId = isEditingLocation ? locationId : null
  const isAddingLocation = locationId === 'new'
  const mapRef = useRef(null)
  const isViewingLocation = locationId !== null && locationId !== 'new'
  const mapsRef = useRef(null)
  const [draggedPosition, setDraggedPosition] = useState(null)
  const isDesktop = useIsDesktop()
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

  const handleNonspecificClick = () => {
    if (isViewingLocation) {
      history.push('/map')
    }
  }
  return (
    <>
      <PanoramaHandler
        mapRef={mapRef}
        mapsRef={mapsRef}
        showStreetView={showStreetView}
      />
      {showStreetView && <CloseStreetView onClick={closeStreetView} />}
      <GoogleMapReact
        onClick={({ event }) => {
          handleNonspecificClick()
          event.stopPropagation()
        }}
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
            label={showLabels ? getCommonName(location.type_ids[0]) : undefined}
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
    </>
  )
}

export default Map
