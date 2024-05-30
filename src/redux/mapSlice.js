import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fitBounds } from 'google-map-react'
import { eqBy, prop, unionWith } from 'ramda'
import { toast } from 'react-toastify'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../constants/map'
import { getClusters, getLocations } from '../utils/api'
import { parseUrl } from '../utils/getInitialUrl'
import { searchView } from './searchView'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'
/**
 * Initial view state of the map.
 * @constant {Object}
 * @property {number[]} center - The latitude and longitude of the map's center
 * @property {number} zoom - The map's zoom level
 * @property {Object} bounds - The latitude and longitude of the map's NE, NW, SE, and SW corners
 */
const { isInitialEntry, ...initialView } = parseUrl()

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
      selectParams(state, { zoom: state.map.view.zoom + 1 }),
    )
  },
)

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    view: initialView,
    isInitialEntry,
    oldView: null,
    isLoading: false,
    locations: [],
    isFilterUpdated: false,
    clusters: [],
    hoveredLocationId: null,
    geolocation: null,
    isTrackingLocation: false,
    justStartedTrackingLocation: false,
    userDeniedLocation: false,
    locationRequested: false,
    streetView: false,
    location: null,
  },
  reducers: {
    // important: only dispatch viewChange in the handler of onViewChange in MapPage
    // this should be called viewChange
    viewChange: setReducer('view'),
    setHoveredLocationId: setReducer('hoveredLocationId'),
    setStreetView: setReducer('streetView'),

    updateEntryLocation: (state, action) => {
      state.location = action.payload

      if (state.isInitialEntry) {
        const { lat, lng } = state.location

        state.isInitialEntry = false
        state.view = {
          center: {
            lat,
            lng,
          },
          zoom: 16,
        }
      }
    },

    startTrackingLocation: (state) => {
      state.locationRequested = true
      state.isTrackingLocation = true

      if (state.geolocation) {
        state.view.center = {
          lat: state.geolocation.latitude,
          lng: state.geolocation.longitude,
        }
        state.view.zoom = Math.max(state.view.zoom, MIN_TRACKING_ZOOM)
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
        if (action.payload.error.code === 1) {
          // code 1 of GeolocationPositionError means user denied location request
          // browsers will block subsequent requests so disable the setting
          state.userDeniedLocation = true
        } else {
          // Treat code 2, internal error, as fatal
          // Toast the message and suggest a retry
          //
          // The last value is code 3, timeout, is unreachable as we use the default of no timeout
          // @see src/components/map/ConnectedGeolocation.js
          if (!state.geolocation.error) {
            toast.error(
              `Geolocation failed: ${action.payload.error.message}. Please refresh the page and retry`,
            )
          } else {
            // We already toasted
          }
        }
        state.isTrackingLocation = false
        state.justStartedTrackingLocation = false
      } else if (state.isTrackingLocation) {
        // If user is tracking location, then center screen continually on geolocation

        if (state.justStartedTrackingLocation) {
          // If user just started tracking location, then we should zoom in, too
          state.justStartedTrackingLocation = false
          state.view.zoom = Math.max(state.view.zoom, MIN_TRACKING_ZOOM)
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
      state.view.zoom = Math.max(state.view.zoom, MIN_LOCATION_ZOOM)
    },
    restoreOldView: (state) => {
      if (state.oldView) {
        state.view = { ...state.oldView }
      }
    },
    zoomIn: (state, action) => {
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
    },
  },
  extraReducers: {
    [updateSelection]: (state) => {
      state.isFilterUpdated = true
    },

    [searchView.type]: (state, action) => {
      state.view = fitBounds(action.payload, state.view.size)
    },

    [fetchMapLocations.pending]: (state) => {
      state.isLoading = true
    },
    [fetchMapLocations.fulfilled]: (state, action) => {
      const { ne, sw } = state.view.bounds

      if (state.isFilterUpdated) {
        state.location = null
        state.locations = action.payload
        state.isFilterUpdated = false
      } else {
        // Drop locations out of bounds
        const locationsInBounds = state.locations.filter(
          ({ lat, lng }) =>
            lat <= ne.lat && lng <= ne.lng && lat >= sw.lat && lng >= sw.lng,
        )

        // Combine with new locations in bounds
        state.locations = unionWith(
          eqBy(prop('id')),
          locationsInBounds,
          action.payload,
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
  },
})

export const {
  zoomInAndSave,
  restoreOldView,
  zoomIn,
  clusterClick,
  viewChange,
  setHoveredLocationId,
  updateEntryLocation,
  startTrackingLocation,
  stopTrackingLocation,
  geolocationChange,
  setStreetView,
} = mapSlice.actions

export default mapSlice.reducer
