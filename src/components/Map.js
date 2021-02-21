import GoogleMap from 'google-map-react'
import PropTypes from 'prop-types'
import React from 'react'

import Cluster from './Cluster'
import Location from './Location'

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
    {clusters.map((cluster, index) => (
      <Cluster
        key={index}
        onClick={() => onClusterClick(cluster.lat, cluster.lng)}
        count={cluster.count}
        lat={cluster.lat}
        lng={cluster.lng}
      />
    ))}
    {locations.map((location) => (
      <Location
        key={location.id}
        onClick={() => onLocationClick(location.id)}
        lat={location.lat}
        lng={location.lng}
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
