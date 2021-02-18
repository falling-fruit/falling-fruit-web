import React from 'react'
import GoogleMap from 'google-map-react'
import Marker from '../Marker/Marker.js'
import Cluster from '../Cluster/Cluster.js'

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
      {locations.map((location) => (
        <Marker key={location.id} lat={location.lat} lng={location.lng} />
      ))}

      {clusters.map((cluster, index) => (
        <Cluster key={index} lat={cluster.lat} lng={cluster.lng} />
      ))}
    </GoogleMap>
  )
}

export default Map
