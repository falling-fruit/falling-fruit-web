import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

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
