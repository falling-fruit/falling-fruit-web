import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { getClusters, getLocations } from '../utils/api'
import { currentPathWithView } from '../utils/appUrl'
import isNetworkError from '../utils/isNetworkError'
import {
  addNewLocation,
  deleteExistingLocation,
  editExistingLocation,
} from './locationSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

export const fetchMapLocations = createAsyncThunk(
  'map/fetchMapLocations',
  async (_, { getState }) => {
    const state = getState()
    const { types, muni } = state.filter
    const { lastMapView } = state.viewport
    if (lastMapView) {
      const { bounds, zoom, center: _ } = lastMapView
      return await getLocations(
        selectParams(
          { types, muni, bounds, zoom, center: undefined },
          { limit: 1000 },
        ),
      )
    } else {
      return []
    }
  },
)

export const fetchMapClusters = createAsyncThunk(
  'map/fetchMapClusters',
  async (_, { getState }) => {
    const state = getState()
    const { types, muni } = state.filter
    const { lastMapView } = state.viewport
    if (lastMapView) {
      const { bounds, zoom, center: _ } = lastMapView
      return await getClusters(
        selectParams({
          types,
          muni,
          bounds,
          zoom: zoom + 1,
          center: undefined,
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
    initialView: null,
    isLoading: true,
    locations: [],
    isFilterUpdated: false,
    clusters: [],
    googleMap: null,
    getGoogleMaps: null,
    isStale: false,
  },
  reducers: {
    setGoogle: (state, action) => {
      state.googleMap = action.payload.googleMap
      state.getGoogleMaps = action.payload.getGoogleMaps
    },
    disconnectMap: (state) => {
      state.initialView = null
      state.googleMap = null
      state.getGoogleMaps = null
    },
    setInitialView: (state, action) => {
      state.initialView = action.payload

      const newUrl = currentPathWithView(state.initialView)

      window.history.pushState({}, '', newUrl)
    },
  },
  extraReducers: {
    [updateSelection]: (state) => {
      state.isFilterUpdated = true
    },
    [fetchMapLocations.pending]: (state) => {
      state.isLoading = true
    },
    [fetchMapLocations.rejected]: (state, action) => {
      state.isLoading = false
      if (isNetworkError(action.error)) {
        state.isStale = true
      } else {
        toast.error(
          i18next.t('error_message.api.fetch_map_locations_failed', {
            message:
              action.error.message || i18next.t('error_message.unknown_error'),
          }),
        )
      }
    },
    [fetchMapClusters.pending]: (state) => {
      state.isLoading = true
    },
    [fetchMapClusters.rejected]: (state, action) => {
      state.isLoading = false
      if (isNetworkError(action.error)) {
        state.isStale = true
      } else {
        toast.error(
          i18next.t('error_message.api.fetch_map_clusters_failed', {
            message:
              action.error.message || i18next.t('error_message.unknown_error'),
          }),
        )
      }
    },
    [editExistingLocation.fulfilled]: (state, action) => {
      if (state.clusters.length) {
        return
      }
      const index = state.locations.findIndex(
        (loc) => loc.id === action.payload.id,
      )
      if (index !== -1) {
        state.locations[index] = action.payload
      }
    },
    [addNewLocation.fulfilled]: (state, action) => {
      if (state.clusters.length) {
        return
      }
      state.locations.push(action.payload)
    },
    [deleteExistingLocation.fulfilled]: (state, action) => {
      if (state.clusters.length) {
        return
      }
      state.locations = state.locations.filter(
        (loc) => loc.id !== action.payload,
      )
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
        const locationsInBounds = state.locations.filter(
          ({ lat, lng }) =>
            lat <= north && lng <= east && lat >= south && lng >= west,
        )
        const locationMap = new Map()

        locationsInBounds.forEach((loc) => {
          locationMap.set(loc.id, loc)
        })

        // add/overwrite with payload locations (these take priority)
        action.payload.forEach((loc) => {
          locationMap.set(loc.id, loc)
        })

        state.locations = Array.from(locationMap.values())
      }

      state.clusters = []
      state.isLoading = false
      state.isStale = false
    },
    [fetchMapClusters.fulfilled]: (state, action) => {
      state.clusters = action.payload
      state.locations = []
      state.isLoading = false
      state.isStale = false
    },
  },
})

export const { disconnectMap, setGoogle, setInitialView } = mapSlice.actions

export default mapSlice.reducer
