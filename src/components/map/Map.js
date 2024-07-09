import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { updatePosition } from '../../redux/locationSlice'
import { setStreetView } from '../../redux/mapSlice'
import CloseStreetView from './CloseStreetView'
import Cluster from './Cluster'
import Geolocation from './Geolocation'
import Location from './Location'
import PanoramaHandler from './PanoramaHandler'
import { DraggableMapPin } from './Pins'
import Place from './Place'

/**
 * Wrapper component around google-map-react.
 * @param {string} apiKey - The google maps API key
 * @param {Object} view - The current view state
 * @param {Object[]} locations - The locations to display
 * @param {Object[]} clusters - The clusters to display
 * @param {function} onClusterClick - The function called when a cluster is clicked
 * @param {function} onLocationClick - The function called when a location is clicked
 * @param {function} onViewChange - The function called when the view state is changed
 * @param {boolean} showLabels - Will display labels under locations if true
 * @param {boolean} showBusinesses - Will display businesses in the map if true
 */

const Map = ({
  bootstrapURLKeys,
  view,
  geolocation,
  place,
  locations,
  activeLocationId,
  editingLocationId,
  clusters,
  onGeolocationClick,
  onClusterClick,
  onLocationClick,
  onNonspecificClick,
  onViewChange,
  showLabels,
  mapType,
  layerTypes,
  showBusinesses,
  showStreetView,
  position,
}) => {
  const mapRef = useRef(null)
  const mapsRef = useRef(null)
  const [draggedPosition, setDraggedPosition] = useState(null)
  useEffect(() => {
    setDraggedPosition(position)
  }, [position])
  const dispatch = useDispatch()

  const apiIsLoaded = (map, maps) => {
    mapRef.current = map
    mapsRef.current = maps
  }

  const closeStreetView = (event) => {
    event.stopPropagation()
    dispatch(setStreetView(false))
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
          onNonspecificClick()
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
        onChange={onViewChange}
        resetBoundsOnResize
        onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
        {geolocation && !geolocation.loading && !geolocation.error && (
          <Geolocation
            onClick={onGeolocationClick}
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
            onClick={
              onClusterClick
                ? (event) => {
                    onClusterClick(cluster)
                    event.stopPropagation()
                  }
                : undefined
            }
            count={cluster.count}
            lat={cluster.lat}
            lng={cluster.lng}
          />
        ))}
        {locations.map((location) => (
          <Location
            key={location.id}
            onClick={
              onLocationClick
                ? (event) => {
                    onLocationClick(location)
                    event.stopPropagation()
                  }
                : undefined
            }
            lat={location.lat}
            lng={location.lng}
            selected={location.id === activeLocationId}
            editing={location.id === editingLocationId}
            label={showLabels ? location.typeName : undefined}
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

Map.propTypes = {
  bootstrapURLKeys: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  geolocation: PropTypes.object,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  place: PropTypes.object,
  activeLocationId: PropTypes.number,
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func,
  onLocationClick: PropTypes.func,
  mapType: PropTypes.string,
  layerTypes: PropTypes.arrayOf(PropTypes.string),
  showLabels: PropTypes.bool,
  showBusinesses: PropTypes.bool,
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
}

export default Map
