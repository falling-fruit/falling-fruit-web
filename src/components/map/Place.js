import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { createPlaceMarker } from './createPlaceMarker'

const Place = ({ lat, lng, label }) => {
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return undefined
    }

    const google = getGoogleMaps()
    const marker = createPlaceMarker(google, googleMap, { lat, lng }, label)
    markerRef.current = marker

    return () => {
      marker.setMap(null)
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleMap, getGoogleMaps])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.update({ lat, lng }, label)
    }
  }, [lat, lng, label])

  return null
}

export default Place
