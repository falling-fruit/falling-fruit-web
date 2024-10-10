import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { getClusters, getLocations } from '../utils/api'
import { currentPathWithView } from '../utils/appUrl'
import { geolocationReceived, GeolocationState } from './geolocationSlice'
import { submitLocation } from './locationSlice'
import { selectPlace } from './placeSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

const MIN_TRACKING_ZOOM = 16

export const fetchMapLocations = createAsyncThunk(
  'map/fetchMapLocations',
  async (_, { getState }) => {
    const state = getState()
    const { types, muni, invasive } = state.filter
    const { lastMapView } = state.viewport
    if (lastMapView) {
      const { bounds, zoom, center: _ } = lastMapView
      return await getLocations(
        selectParams(
          { types, muni, invasive, bounds, zoom, center: undefined },
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
      const { bounds, zoom, center: _ } = lastMapView
      return await getClusters(
        selectParams({
          types,
          muni,
          invasive,
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

      // 1. Remember the initial view
      const initialView = {
        center: state.googleMap.getCenter().toJSON(),
        zoom: state.googleMap.getZoom(),
      }

      // 2. Test newFallback
      const newFallback = action.payload.place.newFallback.view
      state.googleMap.setCenter(newFallback.center)
      state.googleMap.setZoom(newFallback.zoom)
      const newFallbackResult = {
        center: state.googleMap.getCenter().toJSON(),
        zoom: state.googleMap.getZoom(),
      }

      // Reset to initial view
      state.googleMap.setCenter(initialView.center)
      state.googleMap.setZoom(initialView.zoom)

      // 3. Test oldFallback
      const oldFallback = action.payload.place.oldFallback.view
      state.googleMap.setCenter(oldFallback.center)
      state.googleMap.setZoom(oldFallback.zoom)
      const oldFallbackResult = {
        center: state.googleMap.getCenter().toJSON(),
        zoom: state.googleMap.getZoom(),
      }

      // Reset to initial view
      state.googleMap.setCenter(initialView.center)
      state.googleMap.setZoom(initialView.zoom)

      // 4. Test fitBounds
      state.googleMap.fitBounds(bounds)
      const fitBoundsResult = {
        center: state.googleMap.getCenter().toJSON(),
        zoom: state.googleMap.getZoom(),
      }

      // 5. Calculate distances between centers and log results
      const newToOldDistance = calculateDistance(
        newFallbackResult.center.lat,
        newFallbackResult.center.lng,
        oldFallbackResult.center.lat,
        oldFallbackResult.center.lng,
      )
      const newToFitBoundsDistance = calculateDistance(
        newFallbackResult.center.lat,
        newFallbackResult.center.lng,
        fitBoundsResult.center.lat,
        fitBoundsResult.center.lng,
      )
      const oldToFitBoundsDistance = calculateDistance(
        oldFallbackResult.center.lat,
        oldFallbackResult.center.lng,
        fitBoundsResult.center.lat,
        fitBoundsResult.center.lng,
      )

      console.log({
        ...newFallbackResult,
        distanceToOldFallback: `${newToOldDistance.toFixed(6)} km`,
        distanceToFitBounds: `${newToFitBoundsDistance.toFixed(6)} km`,
        zoomDiffOldFallback: newFallbackResult.zoom - oldFallbackResult.zoom,
        zoomDiffFitBounds: newFallbackResult.zoom - fitBoundsResult.zoom,
        oldFallbackResult,
        oldToFitBoundsDistance,
        fitBoundsResult,
      })

      // Keep the fitBounds result as the final view
    },
  },
})

export const { setGoogle, setInitialView } = mapSlice.actions

export default mapSlice.reducer
