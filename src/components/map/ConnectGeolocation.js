import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGeolocation } from 'react-use'

import {
  geolocationCentering,
  geolocationError,
  geolocationFollowing,
  geolocationLoading,
  GeolocationState,
  geolocationTracking,
} from '../../redux/geolocationSlice'
import { distanceInMeters } from '../../utils/mapDistance'

export const isGeolocationOpen = (geolocationState) =>
  geolocationState !== GeolocationState.INITIAL &&
  geolocationState !== GeolocationState.DENIED

const MIN_TRACKING_ZOOM = 16

export const ConnectGeolocation = () => {
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const maps = getGoogleMaps()
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

  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 60000,
  })

  useEffect(() => {
    switch (geolocationState) {
      case GeolocationState.REQUESTED:
        dispatch(geolocationLoading())
        break

      case GeolocationState.LOADING:
      case GeolocationState.CENTERING:
      case GeolocationState.TRACKING:
      case GeolocationState.DOT_ON:
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
        break
      case GeolocationState.INITIAL:
      case GeolocationState.DENIED:
        // Should not happen
        // @see
        break

      default:
    }
  }, [geolocation.loading, Math.round(geolocation.timestamp / 5000), dispatch]) //eslint-disable-line

  return null
}
