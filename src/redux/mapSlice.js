import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fitBounds as fitBoundsWithSize } from 'google-map-react'

import { getClusters, getLocations } from '../utils/api'
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
  },
  reducers: {
    setView: setReducer('view'),
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
    fitBounds: (state, action) => {
      state.view = fitBoundsWithSize(action.payload, state.view.size)
    },
    clusterClick: (state, action) => {
      state.view = {
        center: action.payload,
        zoom: state.view.zoom + 2,
      }
    },
    setHoveredLocationId: setReducer('hoveredLocationId'),
  },
  extraReducers: {
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
  fitBounds,
  clusterClick,
  setView,
  setHoveredLocationId,
  updateFilters,
} = mapSlice.actions

export default mapSlice.reducer
