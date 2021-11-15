import GoogleMapReact from 'google-map-react'
import PropTypes from 'prop-types'

import Cluster from './Cluster'
import Geolocation from './Geolocation'
import Location from './Location'

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
  locations,
  activeLocationId,
  clusters,
  onGeolocationClick,
  onClusterClick,
  onLocationClick,
  onViewChange,
  showLabels,
  mapType,
  layerTypes,
  showBusinesses,
}) => (
  <GoogleMapReact
    bootstrapURLKeys={bootstrapURLKeys}
    options={() => ({
      mapTypeId: mapType,
      disableDefaultUI: true,
      // TODO: should we disable tilt?
      // tilt: 0,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: showBusinesses ? 'on' : 'off' }],
        },
      ],
    })}
    layerTypes={layerTypes}
    center={view.center}
    zoom={view.zoom}
    onChange={onViewChange}
    resetBoundsOnResize
  >
    {geolocation && !geolocation.loading && (
      <Geolocation
        onClick={onGeolocationClick}
        lat={geolocation.latitude}
        lng={geolocation.longitude}
        heading={geolocation.heading}
      />
    )}
    {clusters.map((cluster) => (
      <Cluster
        key={JSON.stringify(cluster)}
        onClick={(event) => {
          onClusterClick(cluster)
          event.stopPropagation()
        }}
        count={cluster.count}
        lat={cluster.lat}
        lng={cluster.lng}
      />
    ))}
    {locations.map((location) => (
      <Location
        key={location.id}
        onClick={(event) => {
          onLocationClick(location)
          event.stopPropagation()
        }}
        lat={location.lat}
        lng={location.lng}
        selected={location.id === activeLocationId}
        label={showLabels ? location.typeName : undefined}
      />
    ))}
  </GoogleMapReact>
)

Map.propTypes = {
  bootstrapURLKeys: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  geolocation: PropTypes.object,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedLocationId: PropTypes.number,
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
  mapType: PropTypes.string,
  layerTypes: PropTypes.arrayOf(PropTypes.string),
  showLabels: PropTypes.bool,
  showBusinesses: PropTypes.bool,
}

export default Map
