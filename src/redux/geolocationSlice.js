import { createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { distanceInMeters } from '../utils/mapDistance'
import { updateLastMapView } from './viewportSlice'

export const GeolocationState = {
  INITIAL: 'INITIAL',
  DENIED: 'DENIED',
  LOADING: 'LOADING',
  FIRST_LOCATION: 'FIRST_LOCATION',
  CENTERING: 'CENTERING',
  TRACKING: 'TRACKING',
  DOT_ON: 'DOT_ON',
}

export const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState: {
    geolocationState: GeolocationState.INITIAL,
    geolocation: null,
  },
  reducers: {
    requestGeolocation: (state) => {
      state.geolocationState = GeolocationState.LOADING
    },
    geolocationDenied: (state) => {
      state.geolocationState = GeolocationState.DENIED
    },
    disableGeolocation: (state) => {
      state.geolocationState = GeolocationState.INITIAL
      state.geolocation = null
    },
    geolocationCentering: (state, action) => {
      state.geolocationState = GeolocationState.CENTERING
      state.geolocation = action.payload
    },
    geolocationFollowing: (state, action) => {
      state.geolocationState = GeolocationState.DOT_ON
      state.geolocation = action.payload
    },
    geolocationTracking: (state, action) => {
      state.geolocationState = GeolocationState.TRACKING
      state.geolocation = action.payload
    },
    geolocationError: (state, action) => {
      switch (action.payload.code) {
        case 1:
          // code 1 of GeolocationPositionError means user denied location request
          // browsers will block subsequent requests so disable the setting
          state.geolocationState = GeolocationState.DENIED
          break
        case 3:
          // code 3, timeout
          // Toast the message and suggest a retry
          //
          // @see src/components/map/ConnectedGeolocation.js
          state.geolocationState = GeolocationState.INITIAL
          toast.error(i18next.t('error_message.geolocation.code_3'), {
            message:
              action.payload.message ||
              i18next.t('error_message.unknown_error'),
          })
          break
        case 2:
        default:
          // code 2, internal error, or missing code
          // Toast the message and suggest a retry
          //
          // @see src/components/map/ConnectedGeolocation.js
          state.geolocationState = GeolocationState.INITIAL
          toast.error(i18next.t('error_message.geolocation.code_2'), {
            message:
              action.payload.message ||
              i18next.t('error_message.unknown_error'),
          })
          break
      }
    },
  },
  extraReducers: {
    [updateLastMapView]: (state, action) => {
      if (!state.geolocation || state.geolocation.loading) {
        // Still loading - do nothing
      } else if (state.geolocationState === GeolocationState.CENTERING) {
        // The view changed because we centered on the geolocation dot - update state
        state.geolocationState = GeolocationState.TRACKING
      } else {
        const {
          center: { lat, lng },
        } = action.payload
        const { latitude, longitude } = state.geolocation

        // We allow zoom in/out or a tiny movement but panning the map should disable the centering
        const distanceMeters = distanceInMeters(latitude, longitude, lat, lng)
        if (distanceMeters > 1) {
          state.geolocationState = GeolocationState.DOT_ON
        }
      }
    },
  },
})

export const {
  requestGeolocation,
  geolocationDenied,
  geolocationLoading,
  geolocationCentering,
  geolocationFollowing,
  geolocationError,
  disableGeolocation,
  geolocationTracking,
} = geolocationSlice.actions

export default geolocationSlice.reducer
