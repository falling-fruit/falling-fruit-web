import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  geolocationCentering,
  geolocationError,
  geolocationFollowing,
  geolocationReceived,
  GeolocationState,
  geolocationTracking,
} from '../../redux/geolocationSlice'
import { distanceInMeters } from '../../utils/mapDistance'
import { getBoundsForScreenSize } from '../../utils/viewportBounds'

export const isGeolocationOpen = (geolocationState) =>
  geolocationState !== GeolocationState.INITIAL &&
  geolocationState !== GeolocationState.DENIED

const MIN_TRACKING_ZOOM = 16

const useGeolocation = () => {
  const { t } = useTranslation()
  const [state, setState] = useState({
    loading: true,
    heading: null,
    latitude: null,
    longitude: null,
    error: null,
  })

  const watchId = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: {
          code: 0,
          message: t('error_message.geolocation.not_supported'),
        },
      }))
      return
    }

    const onSuccess = (position) => {
      const { heading, latitude, longitude } = position.coords

      setState({
        loading: false,
        heading,
        latitude,
        longitude,
        error: null,
        timestamp: position.timestamp,
      })
    }

    const onError = (error) => {
      setState((s) => ({
        ...s,
        loading: false,
        error,
      }))
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 60000,
    }

    watchId.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options,
    )

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}

const calculateViewContainingLocationAndTrackingDot = (
  userLat,
  userLng,
  locationLat,
  locationLng,
  mapWidth,
  mapHeight,
  currentZoom,
) => {
  const midLat = (userLat + locationLat) / 2
  const midLng = (userLng + locationLng) / 2
  const center = { lat: midLat, lng: midLng }

  const north = Math.max(userLat, locationLat)
  const south = Math.min(userLat, locationLat)
  const east = Math.max(userLng, locationLng)
  const west = Math.min(userLng, locationLng)

  const latSpan = north - south
  const lngSpan = east - west
  const padding = 0.1

  const paddedNorth = north + latSpan * padding
  const paddedSouth = south - latSpan * padding
  const paddedEast = east + lngSpan * padding
  const paddedWest = west - lngSpan * padding

  let zoom = Math.max(currentZoom, MIN_TRACKING_ZOOM)

  for (let testZoom = zoom; testZoom > 0; testZoom--) {
    const bounds = getBoundsForScreenSize(center, testZoom, mapWidth, mapHeight)
    if (
      bounds.north >= paddedNorth &&
      bounds.south <= paddedSouth &&
      bounds.east >= paddedEast &&
      bounds.west <= paddedWest
    ) {
      zoom = testZoom
      break
    }
  }

  return { lat: midLat, lng: midLng, zoom }
}

const getContainingView = (
  geolocation,
  location,
  currentCenter,
  currentZoom,
  mapWidth,
  mapHeight,
) => {
  if (!geolocation.latitude || !geolocation.longitude) {
    return { center: null, zoom: null, shouldUpdate: false }
  }

  let targetLat = geolocation.latitude
  let targetLng = geolocation.longitude
  let zoom = Math.max(currentZoom, MIN_TRACKING_ZOOM)

  if (location && location.lat && location.lng) {
    const userCenter = { lat: geolocation.latitude, lng: geolocation.longitude }
    const bounds = getBoundsForScreenSize(userCenter, zoom, mapWidth, mapHeight)

    if (
      location.lat > bounds.north ||
      location.lat < bounds.south ||
      location.lng > bounds.east ||
      location.lng < bounds.west
    ) {
      const viewData = calculateViewContainingLocationAndTrackingDot(
        geolocation.latitude,
        geolocation.longitude,
        location.lat,
        location.lng,
        mapWidth,
        mapHeight,
        currentZoom,
      )
      targetLat = viewData.lat
      targetLng = viewData.lng
      zoom = viewData.zoom
    }
  }

  const shouldUpdate =
    1 <
    distanceInMeters(currentCenter.lat, currentCenter.lng, targetLat, targetLng)

  return {
    center: { lat: targetLat, lng: targetLng },
    zoom,
    shouldUpdate,
  }
}

const ConnectGeolocationInner = () => {
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const maps = getGoogleMaps ? getGoogleMaps() : null
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [isMapMoving, setIsMapMoving] = useState(false)

  useEffect(() => {
    if (!googleMap) {
      return
    }

    const handleBoundsChanged = () => setIsMapMoving(true)
    const handleIdle = () => setIsMapMoving(false)

    const boundsChangedListener = googleMap.addListener(
      'bounds_changed',
      handleBoundsChanged,
    )
    const idleListener = googleMap.addListener('idle', handleIdle)

    return () => {
      boundsChangedListener.remove()
      idleListener.remove()
    }
  }, [googleMap])

  const geolocationState = useSelector(
    (state) => state.geolocation.geolocationState,
  )

  const selectedLocation = useSelector((state) => state.location.location)

  const geolocation = useGeolocation()

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (geolocation.loading) {
      // Still loading, do nothing
    } else if (geolocation.error) {
      dispatch(geolocationError(geolocation.error))
    } else if (!geolocation.latitude || !geolocation.longitude) {
      dispatch(geolocationError({ message: t('error_message.unknown_error') }))
    } else if (!googleMap) {
      dispatch(geolocationReceived(geolocation))
    } else if (isMapMoving) {
      // Do nothing
    } else {
      const currentCenter = googleMap.getCenter()
      const mapDiv = googleMap.getDiv()
      const { center, zoom, shouldUpdate } = getContainingView(
        geolocation,
        selectedLocation,
        { lat: currentCenter.lat(), lng: currentCenter.lng() },
        googleMap.getZoom(),
        mapDiv.offsetWidth,
        mapDiv.offsetHeight,
      )

      if (
        (geolocationState === GeolocationState.LOADING ||
          geolocationState === GeolocationState.RELOADING) &&
        shouldUpdate
      ) {
        dispatch(
          geolocationCentering({
            geolocation,
            centerPoint: { lat: center.lat, lng: center.lng },
          }),
        )
        if (zoom) {
          googleMap.setZoom(zoom)
        }
        googleMap.panTo(new maps.LatLng(center.lat, center.lng))
      } else if (
        geolocationState === GeolocationState.TRACKING &&
        shouldUpdate
      ) {
        dispatch(
          geolocationCentering({
            geolocation,
            centerPoint: { lat: center.lat, lng: center.lng },
          }),
        )
        googleMap.panTo(new maps.LatLng(center.lat, center.lng))
      } else if (geolocationState === GeolocationState.DOT_ON) {
        dispatch(geolocationFollowing(geolocation))
      } else {
        dispatch(geolocationTracking(geolocation))
      }
    }
  }, [
    googleMap,
    geolocation.loading,
    geolocationState === GeolocationState.RELOADING,
    Math.round(geolocation.timestamp / 5000),
    dispatch,
  ])
  /* eslint-enable react-hooks/exhaustive-deps */

  return null
}
const ConnectGeolocation = () => {
  const geolocationState = useSelector(
    (state) => state.geolocation.geolocationState,
  )

  if (!isGeolocationOpen(geolocationState)) {
    return null
  }

  return <ConnectGeolocationInner />
}

export default ConnectGeolocation
