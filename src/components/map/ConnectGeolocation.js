import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  geolocationCentering,
  geolocationError,
  geolocationFollowing,
  GeolocationState,
  geolocationTracking,
} from '../../redux/geolocationSlice'
import { distanceInMeters } from '../../utils/mapDistance'

export const isGeolocationOpen = (geolocationState) =>
  geolocationState !== GeolocationState.INITIAL &&
  geolocationState !== GeolocationState.DENIED

const MIN_TRACKING_ZOOM = 16

const useGeolocation = () => {
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
          message: 'Geolocation not supported',
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
  }, [])

  return state
}

export const ConnectGeolocation = () => {
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const maps = getGoogleMaps ? getGoogleMaps() : null
  const dispatch = useDispatch()
  const [isMapMoving, setIsMapMoving] = useState(false)

  useEffect(() => {
    if (!googleMap) {
      return
    }

    const handleDragStart = () => setIsMapMoving(true)
    const handleDragEnd = () => setIsMapMoving(false)

    const dragStartListener = googleMap.addListener(
      'dragstart',
      handleDragStart,
    )
    const dragEndListener = googleMap.addListener('dragend', handleDragEnd)

    return () => {
      dragStartListener.remove()
      dragEndListener.remove()
    }
  }, [googleMap])

  /*
    note: if GeolocationState.INITIAL or GeolocationState.DENIED then this component does not render
    @see src/components/map/MapPage.js
    */
  const geolocationState = useSelector(
    (state) => state.geolocation.geolocationState,
  )

  const geolocation = useGeolocation()

  useEffect(() => {
    if (geolocation.loading) {
      // Still loading, do nothing
    } else if (geolocation.error) {
      dispatch(geolocationError(geolocation.error))
    } else if (!geolocation.latitude || !geolocation.longitude) {
      dispatch(geolocationError({ message: 'Unknown error' }))
    } else if (isMapMoving) {
      // Do nothing
    } else {
      const newPosition = new maps.LatLng(
        geolocation.latitude,
        geolocation.longitude,
      )
      const currentCenter = googleMap.getCenter()
      const distanceFromCenter = distanceInMeters(
        currentCenter.lat(),
        currentCenter.lng(),
        geolocation.latitude,
        geolocation.longitude,
      )

      if (
        geolocationState === GeolocationState.LOADING &&
        distanceFromCenter > 1
      ) {
        dispatch(geolocationCentering(geolocation))
        googleMap.setZoom(Math.max(googleMap.getZoom(), MIN_TRACKING_ZOOM))
        googleMap.panTo(newPosition)
      } else if (
        geolocationState === GeolocationState.TRACKING &&
        distanceFromCenter > 1
      ) {
        dispatch(geolocationCentering(geolocation))
        googleMap.panTo(newPosition)
      } else if (geolocationState === GeolocationState.DOT_ON) {
        dispatch(geolocationFollowing(geolocation))
      } else {
        dispatch(geolocationTracking(geolocation))
      }
    }
  }, [geolocation.loading, Math.round(geolocation.timestamp / 5000), dispatch]) //eslint-disable-line

  return null
}
