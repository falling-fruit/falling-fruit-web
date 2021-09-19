import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fitBounds } from 'google-map-react'

import { getClusters, getLocations } from '../utils/api'
import { searchView } from './searchView'
import { selectParams } from './selectParams'

/**
 * Default view state of the map.
 * @constant {Object}
 * @property {number[]} center - The latitude and longitude of the map's center
 * @property {number} zoom - The map's zoom level
 * @property {Object} bounds - The latitude and longitude of the map's NE, NW, SE, and SW corners
 */
const DEFAULT_VIEW_STATE = {
  center: { lat: 40.1125785, lng: -88.2287926 },
  zoom: 1,
}

const TRACKING_LOCATION_ZOOM = 16

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
    return await getClusters(selectParams(state, { zoom: state.map.view.zoom }))
  },
)

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    view: DEFAULT_VIEW_STATE,
    oldView: null,
    isLoading: false,
    locations: [],
    clusters: [],
    hoveredLocationId: null,
    geolocation: null,
    isTrackingLocation: false,
    justStartedTrackingLocation: false,
  },
  reducers: {
    // important: only dispatch viewChange in the handler of onViewChange in MapPage
    // this should be called viewChange
    viewChange: setReducer('view'),
    setHoveredLocationId: setReducer('hoveredLocationId'),

    startTrackingLocation: (state) => {
      console.log('startTrackingLocation')
      state.isTrackingLocation = true

      if (state.geolocation) {
        state.view.center = {
          lat: state.geolocation.latitude,
          lng: state.geolocation.longitude,
        }
        state.view.zoom = TRACKING_LOCATION_ZOOM
      } else {
        state.justStartedTrackingLocation = true
      }
    },
    stopTrackingLocation: (state) => {
      state.isTrackingLocation = false
    },

    geolocationChange: (state, action) => {
      if (action.payload.loading) {
        // Loading
      } else if (action.payload.error) {
        // TODO: send a toast that geolocation isn't working
        state.isTrackingLocation = false
        state.justStartedTrackingLocation = false
      } else if (state.isTrackingLocation) {
        // If user is tracking location, then center screen continually on geolocation

        if (state.justStartedTrackingLocation) {
          // If user just started tracking location, then we should zoom in, too
          state.justStartedTrackingLocation = false
          state.view.zoom = TRACKING_LOCATION_ZOOM
        }
        // Otherwise, keep the current zoom and re-center the screen

        state.view.center = {
          lat: action.payload.latitude,
          lng: action.payload.longitude,
        }
      }

      state.geolocation = action.payload
    },

    zoomInAndSave: (state) => {
      state.oldView = { ...state.view }
      state.view.zoom = 18
    },
    restoreOldView: (state) => {
      if (state.oldView) {
        state.view = { ...state.oldView }
      }
    },
    zoomIn: (state, action) => {
      state.view = {
        center: action.payload,
        zoom: 16,
      }
    },
    clusterClick: (state, action) => {
      state.view = {
        center: action.payload,
        zoom: state.view.zoom + 2,
      }
    },
  },
  extraReducers: {
    [searchView.type]: (state, action) => {
      state.view = fitBounds(action.payload, state.view.size)
    },

    [fetchMapLocations.pending]: (state) => {
      state.isLoading = true
    },
    [fetchMapLocations.fulfilled]: (state, action) => {
      state.locations = action.payload
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
  },
})

export const {
  zoomInAndSave,
  restoreOldView,
  zoomIn,
  clusterClick,
  viewChange,
  setHoveredLocationId,
  startTrackingLocation,
  stopTrackingLocation,
  geolocationChange,
} = mapSlice.actions

export default mapSlice.reducer
