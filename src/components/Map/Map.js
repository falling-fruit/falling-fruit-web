import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'

const Map = withScriptjs(
  withGoogleMap((props) => {
    const {
      view,
      locations,
      onLocationSelect,
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
        {locations.map((location, i) => (
          <Marker
            key={i}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => onLocationSelect(location.id)}
          />
        ))}
      </GoogleMap>
    )
  }),
)

export default Map
