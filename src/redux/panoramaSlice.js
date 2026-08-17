import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { FETCH_RADIUS_METRES, METRES_PER_LAT_DEG } from '../constants/panorama'
import { getLocations } from '../utils/api'
import isNetworkError from '../utils/isNetworkError'
import { selectParams } from './selectParams'

const panoramaBounds = (center) => {
  const latDelta = FETCH_RADIUS_METRES / METRES_PER_LAT_DEG
  const lngDelta =
    FETCH_RADIUS_METRES /
    (METRES_PER_LAT_DEG * Math.cos((center.lat * Math.PI) / 180))
  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lng + lngDelta,
    west: center.lng - lngDelta,
  }
}

export const fetchPanoramaLocations = createAsyncThunk(
  'panorama/fetchPanoramaLocations',
  async (_, { getState }) => {
    const state = getState()
    const { types, muni } = state.filter
    const { panoramaCenter } = state.panorama

    if (!panoramaCenter) {
      return []
    }

    const bounds = panoramaBounds(panoramaCenter)
    const zoom = 16
    return await getLocations(
      selectParams(
        { types, muni, bounds, zoom, center: panoramaCenter },
        { limit: 1000 },
      ),
    )
  },
)

const panoramaSlice = createSlice({
  name: 'panorama',
  initialState: {
    streetViewOpen: false,
    locationsWithoutPanorama: {},
    panoramaReady: false,
    panoramaCenter: null,
    locations: [],
  },
  reducers: {
    openStreetView: (state) => {
      state.streetViewOpen = true
    },
    closeStreetView: (state) => {
      state.streetViewOpen = false
      state.locations = []
    },
    addLocationWithoutPanorama: (state, action) => {
      state.locationsWithoutPanorama[action.payload] = true
    },
    setPanoramaReady: (state, action) => {
      state.panoramaReady = action.payload
    },
    setPanoramaCenter: (state, action) => {
      state.panoramaCenter = action.payload
    },
  },
  extraReducers: {
    [fetchPanoramaLocations.fulfilled]: (state, action) => {
      const locationMap = new Map()
      state.locations.forEach((loc) => {
        locationMap.set(loc.id, loc)
      })
      action.payload.forEach((loc) => {
        locationMap.set(loc.id, loc)
      })
      state.locations = Array.from(locationMap.values())
    },
    [fetchPanoramaLocations.rejected]: (state, action) => {
      if (!isNetworkError(action.error)) {
        toast.error(
          i18next.t('error_message.api.fetch_locations_failed', {
            message:
              action.error.message || i18next.t('error_message.unknown_error'),
          }),
        )
      }
    },
  },
})

export const {
  openStreetView,
  closeStreetView,
  addLocationWithoutPanorama,
  setPanoramaReady,
  setPanoramaCenter,
} = panoramaSlice.actions

export default panoramaSlice.reducer
