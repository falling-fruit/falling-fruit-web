import React from 'react'
import PropTypes from 'prop-types'
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
            count={marker.count}
          />
        ),
      )}
    </GoogleMap>
  )
}

Map.propTypes = {
  bootstrapURLKeys: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  markerData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showLocations: PropTypes.bool.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  handleClusterClick: PropTypes.func.isRequired,
  handleLocationClick: PropTypes.func.isRequired,
}

export default Map
