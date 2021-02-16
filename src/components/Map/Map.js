import React from 'react'
import GoogleMap from 'google-map-react'
import Marker from '../Marker/Marker.js'

const Map = (props) => {
  const { view, bootstrapURLKeys, locations } = props

  return (
    <GoogleMap
      bootstrapURLKeys={bootstrapURLKeys}
      center={view.center}
      zoom={view.zoom}
    >
      {locations.map((location, i) => (
        <Marker key={i} lat={location.lat} lng={location.lng} />
      ))}
    </GoogleMap>
  )
}

export default Map
