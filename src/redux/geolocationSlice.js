import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { updateLastMapView } from './viewportSlice'

export const GeolocationState = {
  INITIAL: 'INITIAL',
  REQUESTED: 'REQUESTED',
  DENIED: 'DENIED',
  LOADING: 'LOADING',
  FIRST_LOCATION: 'FIRST_LOCATION',
  TRACKING: 'TRACKING',
}

export const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState: {
    geolocationState: GeolocationState.INITIAL,
    geolocation: null,
    stopTrackingLocationThreshold: 5000,
  },
  reducers: {
    requestGeolocation: (state) => {
      state.geolocationState = GeolocationState.REQUESTED
    },
    geolocationDenied: (state) => {
      state.geolocationState = GeolocationState.DENIED
    },
    disableGeolocation: (state) => {
      state.geolocationState = GeolocationState.INITIAL
      state.geolocation = null
    },
    geolocationLoading: (state) => {
      state.geolocationState = GeolocationState.LOADING
    },
    geolocationReceived: (state, action) => {
      if (state.geolocationState === GeolocationState.LOADING) {
        state.geolocationState = GeolocationState.FIRST_LOCATION
      } else {
        state.geolocationState = GeolocationState.TRACKING
      }
      state.geolocation = action.payload
    },
    geolocationError: (state, action) => {
      if (action.payload.code === 1) {
        // code 1 of GeolocationPositionError means user denied location request
        // browsers will block subsequent requests so disable the setting
        state.geolocationState = GeolocationState.DENIED
      } else {
        // Treat code 2, internal error, as fatal
        // Toast the message and suggest a retry
        //
        // The last value is code 3, timeout, is unreachable as we use the default of no timeout
        // @see src/components/map/ConnectedGeolocation.js
        state.geolocationState = GeolocationState.INITIAL
        toast.error(
          `Geolocation failed: ${action.payload.message}. Please refresh the page and retry`,
        )
      }
    },
  },
  extraReducers: {
    [updateLastMapView]: (state, action) => {
      const {
        center: { lat, lng },
        zoom,
      } = action.payload
      if (!state.geolocation || state.geolocation.loading) {
        return
      }

      const { latitude, longitude } = state.geolocation

      const dist = Math.pow(lat - latitude, 2) + Math.pow(longitude - lng, 2)
      const screenDist = dist * Math.pow(Math.pow(2, zoom), 2)

      if (screenDist >= state.stopTrackingLocationThreshold) {
        state.geolocationState = GeolocationState.INITIAL
        state.geolocation = null
      }
    },
    layoutChange: (state, action) => {
      state.stopTrackingLocationThreshold = action.payload.isDesktop
        ? 5000
        : 2000
    },
  },
})

export const {
  requestGeolocation,
  geolocationDenied,
  geolocationLoading,
  geolocationReceived,
  geolocationError,
  disableGeolocation,
} = geolocationSlice.actions

export default geolocationSlice.reducer
