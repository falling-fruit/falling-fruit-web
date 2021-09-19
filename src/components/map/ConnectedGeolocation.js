import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGeolocation } from 'react-use'

import { geolocationChange } from '../../redux/mapSlice'

export const ConnectedGeolocation = () => {
  const geolocation = useGeolocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(geolocationChange(geolocation))
  }, [geolocation, dispatch])

  return null
}
