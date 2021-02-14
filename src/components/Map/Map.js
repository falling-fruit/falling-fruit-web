import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'

const Map = withScriptjs(
  withGoogleMap((props) => {
    const { onLocationSelect, defaultView, locations } = props

    return (
      <GoogleMap
        defaultZoom={defaultView.zoom}
        defaultCenter={{ lat: defaultView.lat, lng: defaultView.lng }}
      >
        {locations.map((location, i) => (
          <Marker
            onClick={() => onLocationSelect(location.id)}
            key={i}
            position={{ lat: location.lat, lng: location.lng }}
          />
        ))}
      </GoogleMap>
    )
  }),
)

export default Map
