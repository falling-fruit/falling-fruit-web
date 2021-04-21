import GoogleMap from 'google-map-react'
import PropTypes from 'prop-types'
import React, { useContext } from 'react'

import SearchContext from '../search/SearchContext'
import Cluster from './Cluster'
import Geolocation from './Geolocation'
import Location from './Location'

/**
 * Wrapper component around google-map-react.
 * @param {string} googleMapsAPIKey - The google maps API key
 * @param {Object} view - The current view state
 * @param {Object[]} locations - The locations to display
 * @param {Object[]} clusters - The clusters to display
 * @param {function} onClusterClick - The function called when a cluster is clicked
 * @param {function} onLocationClick - The function called when a location is clicked
 * @param {function} onViewChange - The function called when the view state is changed
 * @param {boolean} showLabels - Will display labels under locations if true
 */
const Map = ({
  googleMapsAPIKey,
  view,
  geolocation,
  locations,
  clusters,
  onGeolocationClick,
  onClusterClick,
  onLocationClick,
  onViewChange,
  showLabels,
}) => {
  const { selectedLocation } = useContext(SearchContext)

  return (
    <GoogleMap
      bootstrapURLKeys={{ key: googleMapsAPIKey }}
      center={view.center}
      zoom={view.zoom}
      onChange={onViewChange}
      resetBoundsOnResize
    >
      {!geolocation.loading && (
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
          selected={location.id === selectedLocation?.id}
          label={showLabels && location.type_names[0]}
        />
      ))}
    </GoogleMap>
  )
}

Map.propTypes = {
  googleMapsAPIKey: PropTypes.string.isRequired,
  view: PropTypes.object.isRequired,
  geolocation: PropTypes.object,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
  showLabels: PropTypes.bool,
}

export default Map
