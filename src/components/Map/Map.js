import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer'

const Map = withScriptjs(
  withGoogleMap((props) => {
    const { onClusterSelect, onLocationSelect, defaultView, locations } = props

    return (
      <GoogleMap
        defaultZoom={defaultView.zoom}
        defaultCenter={{ lat: defaultView.lat, lng: defaultView.lng }}
      >
        {
          // TODO: Figure out why marker cluster thinks there are 6 markers when there are only 3
        }
        <MarkerClusterer
          onClick={onClusterSelect}
          defaultMinimumClusterSize={5}
        >
          {locations.map((location, i) => (
            <Marker
              key={i}
              onClick={() => onLocationSelect(location.id)}
              position={{ lat: location.lat, lng: location.lng }}
            />
          ))}
        </MarkerClusterer>
      </GoogleMap>
    )
  }),
)

export default Map
