import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { getClusters, getLocations } from '../utils/api'
import { currentPathWithView } from '../utils/appUrl'
import { geolocationReceived, GeolocationState } from './geolocationSlice'
import { submitLocation } from './locationSlice'
import { selectPlace } from './placeSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

const MIN_TRACKING_ZOOM = 16

export const fetchMapLocations = createAsyncThunk(
  'map/fetchMapLocations',
  async (_, { getState }) => {
    const state = getState()
    const { types, muni, invasive } = state.filter
    const { lastMapView } = state.viewport
    if (lastMapView) {
      const { bounds, zoom, center } = lastMapView
      return await getLocations(
        selectParams(
          { types, muni, invasive, bounds, zoom, center },
          { limit: 250 },
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
    const { types, muni, invasive } = state.filter
    const { lastMapView } = state.viewport
    if (lastMapView) {
      const { bounds, zoom, center } = lastMapView
      return await getClusters(
        selectParams({ types, muni, invasive, bounds, zoom: zoom + 1, center }),
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
  },
  reducers: {
    setGoogle: (state, action) => {
      state.googleMap = action.payload.googleMap
      state.getGoogleMaps = action.payload.getGoogleMaps
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
    [submitLocation.fulfilled]: (state, action) => {
      if (state.clusters.length) {
        return
      }
      const index = state.locations.findIndex(
        (loc) => loc.id === action.payload.id,
      )
      if (index !== -1) {
        // Update existing location
        state.locations[index] = action.payload
      } else {
        // Add new location
        state.locations.push(action.payload)
      }
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
        state.googleMap.setZoom(
          Math.max(state.googleMap.getZoom(), MIN_TRACKING_ZOOM),
        )
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

export const { setGoogle, setInitialView } = mapSlice.actions

export default mapSlice.reducer
