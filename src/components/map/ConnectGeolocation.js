import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGeolocation } from 'react-use'

import {
  geolocationError,
  geolocationLoading,
  geolocationReceived,
  GeolocationState,
} from '../../redux/geolocationSlice'

export const isGeolocationOpen = (geolocationState) =>
  geolocationState !== GeolocationState.INITIAL &&
  geolocationState !== GeolocationState.DENIED
export const ConnectGeolocation = () => {
  const dispatch = useDispatch()

  /*
    note: if GeolocationState.INITIAL or GeolocationState.DENIED then this component does not render
    @see src/components/map/MapPage.js
    */
  const geolocationState = useSelector(
    (state) => state.geolocation.geolocationState,
  )

  const geolocation = useGeolocation({
    enableHighAccuracy: true,
  })

  useEffect(() => {
    switch (geolocationState) {
      case GeolocationState.REQUESTED:
        dispatch(geolocationLoading())
        break

      case GeolocationState.LOADING:
      case GeolocationState.TRACKING:
      case GeolocationState.FIRST_LOCATION:
        if (geolocation.loading) {
          // Still loading, do nothing
        } else if (geolocation.error) {
          dispatch(geolocationError(geolocation.error))
        } else if (geolocation.latitude && geolocation.longitude) {
          dispatch(
            geolocationReceived({
              latitude: geolocation.latitude,
              longitude: geolocation.longitude,
              accuracy: geolocation.accuracy,
              geolocationState,
            }),
          )
        }
        break

      case GeolocationState.INITIAL:
      case GeolocationState.DENIED:
        // Do nothing for these states
        // @see
        break

      default:
        console.warn(`Unhandled geolocation state: ${geolocationState}`)
    }
  }, [geolocationState, geolocation, dispatch])

  return null
}
