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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleMap, getGoogleMaps, shouldRender])

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
