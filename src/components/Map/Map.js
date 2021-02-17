import React from 'react'
import GoogleMap from 'google-map-react'
import Marker from '../Marker/Marker.js'

const Map = (props) => {
  const { bootstrapURLKeys, view, locations, onChange } = props

  return (
    <GoogleMap
      bootstrapURLKeys={bootstrapURLKeys}
      center={view.center}
      zoom={view.zoom}
      onChange={onChange}
    >
      {locations.map((location, i) => (
        <Marker key={i} lat={location.lat} lng={location.lng} />
      ))}
    </GoogleMap>
  )
}

export default Map
