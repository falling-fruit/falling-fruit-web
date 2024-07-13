import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fitBounds } from 'google-map-react'
import { eqBy, prop, unionWith } from 'ramda'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../constants/map'
import { getClusters, getLocations } from '../utils/api'
import { geolocationReceived, GeolocationState } from './geolocationSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

const MIN_TRACKING_ZOOM = 16
const MIN_LOCATION_ZOOM = 18

export const setReducer = (key) => (state, action) => ({
  ...state,
  [key]: action.payload,
})

export const updateReducer = (key) => (state, action) => ({
  ...state,
  [key]: { ...state[key], ...action.payload },
})

export const fetchMapLocations = createAsyncThunk(
  'map/fetchMapLocations',
  async (_, { getState }) =>
    await getLocations(selectParams(getState(), { limit: 250 })),
)

export const fetchMapClusters = createAsyncThunk(
  'map/fetchMapClusters',
  async (_, { getState }) => {
    const state = getState()
    return await getClusters(
      selectParams(state, {
        zoom: state.map.view?.zoom ? state.map.view.zoom + 1 : null,
      }),
    )
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
    place: null,
  },
  reducers: {
    setView: (state, action) => {
      state.view = action.payload
    },
    setStreetView: setReducer('streetView'),
    setCenterOnLocation: (state, action) => {
      state.view = {
        center: action.payload,
        zoom: Math.max(state.view.zoom, MIN_LOCATION_ZOOM),
      }
    },
    clusterClick: (state, action) => {
      state.view = {
        center: action.payload,
        zoom:
          action.payload.count === 1
            ? VISIBLE_CLUSTER_ZOOM_LIMIT + 1
            : Math.min(VISIBLE_CLUSTER_ZOOM_LIMIT + 1, state.view.zoom + 2),
      }
      state.place = null
    },
    selectPlace: (state, action) => {
      state.place = action.payload.location
      state.view = fitBounds(action.payload.viewport, state.view.size)
    },
    clearSelectedPlace: (state) => {
      state.place = null
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
      const { ne, sw } = state.view.bounds

      if (state.isFilterUpdated) {
        state.locations = action.payload
        state.isFilterUpdated = false
      } else {
        // Drop locations out of bounds
        const locationsInBounds = state.locations.filter(
          ({ lat, lng }) =>
            lat <= ne.lat && lng <= ne.lng && lat >= sw.lat && lng >= sw.lng,
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
      state.view = {
        ...state.view,
        center: {
          lat: action.payload.latitude,
          lng: action.payload.longitude,
        },
      }
      if (action.payload.geolocationState === GeolocationState.FIRST_LOCATION) {
        state.view.zoom = Math.max(state.view.zoom, MIN_TRACKING_ZOOM)
      }
      state.place = null
    },
  },
})

export const {
  setCenterOnLocation,
  clusterClick,
  setView,
  setStreetView,
  selectPlace,
  clearSelectedPlace,
} = mapSlice.actions

export default mapSlice.reducer
