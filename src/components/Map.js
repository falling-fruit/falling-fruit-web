import GoogleMap from 'google-map-react'
import PropTypes from 'prop-types'
import React from 'react'

import Cluster from './Cluster'
import Location from './Location'

const Map = (props) => {
  const {
    bootstrapURLKeys,
    view,
    markerData,
    showLocations,
    onZoomAnimationEnd,
    onDragEnd,
    onClusterClick,
    onLocationClick,
  } = props

  return (
    <GoogleMap
      bootstrapURLKeys={bootstrapURLKeys}
      center={view.center}
      zoom={view.zoom}
      onZoomAnimationEnd={onZoomAnimationEnd}
      onDragEnd={onDragEnd}
    >
      {markerData.map((marker, index) =>
        showLocations ? (
          <Location
            key={marker.id}
            onClick={onLocationClick}
            id={marker.id}
            lat={marker.lat}
            lng={marker.lng}
          />
        ) : (
          <Cluster
            key={index}
            onClick={onClusterClick}
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
  onZoomAnimationEnd: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onClusterClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
}

export default Map
