import React from 'react'
import GoogleMap from 'google-map-react'
import Marker from '../Marker/Marker.js'
import Cluster from '../Cluster/Cluster.js'

const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

const Map = (props) => {
  const {
    bootstrapURLKeys,
    view,
    locations,
    clusters,
    handleViewChange,
    handleMarkerClick,
  } = props

  return (
    <GoogleMap
      bootstrapURLKeys={bootstrapURLKeys}
      center={view.center}
      zoom={view.zoom}
      onChange={handleViewChange}
      onChildClick={handleMarkerClick}
    >
      {view.zoom >= VISIBLE_CLUSTER_ZOOM_LIMIT
        ? locations.map((location) => (
            <Marker key={location.id} lat={location.lat} lng={location.lng} />
          ))
        : clusters.map((cluster, index) => (
            <Cluster key={index} lat={cluster.lat} lng={cluster.lng} />
          ))}
      {/* 
      {view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT && locations.map((location) => (
        <Marker key={location.id} lat={location.lat} lng={location.lng} />
      ))}

      {} */}
    </GoogleMap>
  )
}

export default Map
