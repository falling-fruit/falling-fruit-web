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
    const {
      view,
      locations,
      onLocationSelect,
      onClusterSelect,
      onZoomChanged,
      onCenterChanged,
      onBoundsChanged,
      setMapRef,
    } = props

    return (
      <GoogleMap
        // TODO: Figure out if setting the ref like this is only way to get the zoom/center/bounds changes
        ref={setMapRef}
        zoom={view.zoom}
        center={view.center}
        onZoomChanged={onZoomChanged}
        onCenterChanged={onCenterChanged}
        onBoundsChanged={onBoundsChanged}
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
