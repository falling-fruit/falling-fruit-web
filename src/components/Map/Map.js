import React from 'react'
import GoogleMap from 'google-map-react'
import Marker from '../Marker/Marker.js'

const Map = (props) => {
  const {
    bootstrapURLKeys,
    view,
    locations,
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
    </GoogleMap>
  )
}

export default Map
