import React from 'react'
import GoogleMap from 'google-map-react'
import Location from '../Location/Location.js'
import Cluster from '../Cluster/Cluster.js'

const Map = (props) => {
  const {
    bootstrapURLKeys,
    view,
    markerData,
    showLocations,
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
      {markerData.map((marker, index) =>
        showLocations ? (
          <Location
            key={marker.id}
            onClick={handleLocationClick}
            id={marker.id}
            lat={marker.lat}
            lng={marker.lng}
          />
        ) : (
          <Cluster
            key={index}
            onClick={handleClusterClick}
            lat={marker.lat}
            lng={marker.lng}
          />
        ),
      )}
    </GoogleMap>
  )
}

export default Map
