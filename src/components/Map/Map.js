import React from 'react'
import GoogleMap from 'google-map-react'
import Marker from '../Marker/Marker.js'
import Cluster from '../Cluster/Cluster.js'

const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

const Map = (props) => {
  const {
    bootstrapURLKeys,
    view,
    clusters,
    locations,
    handleViewChange,
    handleClusterClick,
    handleLocationClick,
  } = props

  return (
    <GoogleMap
      bootstrapURLKeys={bootstrapURLKeys}
      center={view.center}
      zoom={view.zoom}
      onChange={handleViewChange}
    >
      {view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT
        ? clusters.map((cluster, index) => (
            <Cluster
              key={index}
              onClick={handleClusterClick}
              lat={cluster.lat}
              lng={cluster.lng}
            />
          ))
        : locations.map((location) => (
            <Marker
              key={location.id}
              onClick={handleLocationClick}
              id={location.id}
              lat={location.lat}
              lng={location.lng}
            />
          ))}
    </GoogleMap>
  )
}

export default Map
