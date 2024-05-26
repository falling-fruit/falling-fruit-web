import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGeolocation } from 'react-use'

import { geolocationChange } from '../../redux/mapSlice'

export const ConnectedGeolocation = () => {
  const geolocation = useGeolocation({
    // Ask the device to use the most accurate means of geolocation
    // We want to help with precise annotation of locations
    // and to provide a good zoomed-in view
    enableHighAccuracy: true,
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(geolocationChange(geolocation))
  }, [geolocation, dispatch])

  return null
}
