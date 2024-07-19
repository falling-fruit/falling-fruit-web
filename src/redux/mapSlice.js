import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { getClusters, getLocations } from '../utils/api'
import { geolocationReceived, GeolocationState } from './geolocationSlice'
import { selectPlace } from './placeSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

const MIN_TRACKING_ZOOM = 16

export const updateReducer = (key) => (state, action) => ({
  ...state,
  [key]: { ...state[key], ...action.payload },
})

export const fetchMapLocations = createAsyncThunk(
  'map/fetchMapLocations',
  async (_, { getState }) => {
    const state = getState()
    const googleMap = state.map.googleMap
    if (googleMap) {
      return await getLocations(selectParams(getState(), { limit: 250 }))
    } else {
      return []
    }
  },
)

export const fetchMapClusters = createAsyncThunk(
  'map/fetchMapClusters',
  async (_, { getState }) => {
    const state = getState()
    const googleMap = state.map.googleMap
    if (googleMap) {
      return await getClusters(
        selectParams(state, {
          zoom: googleMap.getZoom() + 1,
        }),
      )
    } else {
      return []
    }
  },
)

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    view: null,
    isLoading: false,
    locations: [],
    isFilterUpdated: false,
    clusters: [],
    streetView: false,
    googleMap: null,
    getGoogleMaps: null,
  },
  reducers: {
    setGoogle: (state, action) => {
      state.googleMap = action.payload.googleMap
      state.getGoogleMaps = action.payload.getGoogleMaps
    },
    setView: (state, action) => {
      state.view = action.payload
    },
    setStreetView: (state, action) => {
      state.streetView = action.payload
    },
  },
  extraReducers: {
    [updateSelection]: (state) => {
      state.isFilterUpdated = true
    },
    [fetchMapLocations.pending]: (state) => {
      state.isLoading = true
    },
    [fetchMapLocations.fulfilled]: (state, action) => {
      if (!state.googleMap) {
        return
      }
      const { north, east, south, west } = state.googleMap.getBounds().toJSON()

      if (state.isFilterUpdated) {
        state.locations = action.payload
        state.isFilterUpdated = false
      } else {
        // Drop locations out of bounds
        const locationsInBounds = state.locations.filter(
          ({ lat, lng }) =>
            lat <= north && lng <= east && lat >= south && lng >= west,
        )
        // Combine with new locations in bounds
        // If IDs are equal, prioritise the payload
        // to e.g. correctly display a just-updated position
        state.locations = unionWith(
          eqBy(prop('id')),
          action.payload,
          locationsInBounds,
        )
      }

      state.clusters = []
      state.isLoading = false
    },
    [fetchMapClusters.pending]: (state) => {
      state.isLoading = true
    },
    [fetchMapClusters.fulfilled]: (state, action) => {
      state.clusters = action.payload
      state.locations = []
      state.isLoading = false
    },
    [geolocationReceived]: (state, action) => {
      const maps = state.getGoogleMaps()
      const newPosition = new maps.LatLng(
        action.payload.latitude,
        action.payload.longitude,
      )
      if (action.payload.geolocationState === GeolocationState.FIRST_LOCATION) {
        state.googleMap.panTo(newPosition)
        state.googleMap.setZoom(Math.max(state.view.zoom, MIN_TRACKING_ZOOM))
      } else {
        state.googleMap.panTo(newPosition)
      }
    },
    [selectPlace]: (state, action) => {
      const { ne, sw } = action.payload.place.viewport
      const maps = state.getGoogleMaps()
      const bounds = new maps.LatLngBounds(
        { lat: sw.lat, lng: sw.lng },
        { lat: ne.lat, lng: ne.lng },
      )
      state.googleMap.fitBounds(bounds)
    },
  },
})

export const { setGoogle, setView, setStreetView } = mapSlice.actions

export default mapSlice.reducer
