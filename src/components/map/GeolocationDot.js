import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { MIN_GEOLOCATION_ZOOM } from '../../constants/map'
import {
  geolocationCentering,
  GeolocationState,
} from '../../redux/geolocationSlice'
import { createGeolocationMarker } from './createGeolocationMarker'

const GeolocationDot = () => {
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const { geolocation, geolocationState } = useSelector(
    (state) => state.geolocation,
  )
  const dispatch = useDispatch()

  const markerRef = useRef(null)

  // Keep the latest values available to the marker's click handler without
  // recreating the marker on every state change.
  const handlersRef = useRef({})
  handlersRef.current = { geolocation, geolocationState, googleMap, dispatch }

  const handleClick = () => {
    const {
      geolocation: geo,
      geolocationState: state,
      googleMap: map,
      dispatch: dispatchFn,
    } = handlersRef.current

    if (geo && state === GeolocationState.DOT_ON) {
      dispatchFn(geolocationCentering(geo))
      map.panTo({ lat: geo.latitude, lng: geo.longitude })
      if (map.getZoom() < MIN_GEOLOCATION_ZOOM) {
        map.setZoom(MIN_GEOLOCATION_ZOOM)
      }
    }
  }

  const shouldRender =
    geolocation &&
    !geolocation.loading &&
    !geolocation.error &&
    geolocation.latitude != null &&
    geolocation.longitude != null

  const isPulsing = geolocationState !== GeolocationState.DOT_ON
  const isClickable = geolocationState === GeolocationState.DOT_ON

  // Create/destroy the overlay marker with the map lifecycle.
  useEffect(() => {
    if (!googleMap || !getGoogleMaps || !shouldRender) {
      return undefined
    }

    const google = getGoogleMaps()
    const marker = createGeolocationMarker(google, googleMap, geolocation, {
      isPulsing,
      isClickable,
      onClick: handleClick,
    })
    markerRef.current = marker

    return () => {
      marker.setMap(null)
      markerRef.current = null
    }
    // Only re-create when the map or render eligibility changes.
    // Position/state updates are handled by the update effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleMap, getGoogleMaps, shouldRender])

  // Update position/state on the existing overlay without recreating it,
  // preserving the running animation.
  useEffect(() => {
    if (markerRef.current && shouldRender) {
      markerRef.current.update(geolocation, {
        isPulsing,
        isClickable,
        onClick: handleClick,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shouldRender,
    isPulsing,
    isClickable,
    geolocation?.latitude,
    geolocation?.longitude,
    geolocation?.heading,
  ])

  return null
}

export default GeolocationDot
