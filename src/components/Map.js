import GoogleMap from 'google-map-react'
import PropTypes from 'prop-types'
import React from 'react'

import Cluster from './Cluster'
import Location from './Location'

const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

const Map = ({
  googleMapsAPIKey,
  view,
  locations,
  clusters,
  onClusterClick,
  onLocationClick,
  onViewChange,
}) => (
  <GoogleMap
    bootstrapURLKeys={{ key: googleMapsAPIKey }}
    center={view.center}
    zoom={view.zoom}
    onChange={onViewChange}
  >
    {view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT
      ? clusters.map((marker, index) => (
          <Cluster
            key={index}
            onClick={onClusterClick}
            lat={marker.lat}
            lng={marker.lng}
            count={marker.count}
          />
        ))
      : locations.map((marker) => (
          <Location
            key={marker.id}
            onClick={() => onLocationClick(location)}
            id={marker.id}
            lat={marker.lat}
            lng={marker.lng}
          />
        ))}
  </GoogleMap>
)

Map.propTypes = {
  googleMapsAPIKey: PropTypes.string.isRequired,
  view: PropTypes.object.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  clusters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
}

export default Map
