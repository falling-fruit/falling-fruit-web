import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { getLocationById } from '../utils/api'
import { fetchReviewData } from './reviewSlice'

export const fetchLocationData = createAsyncThunk(
  'locations/fetchLocationData',
  async ({ locationId }) => {
    const locationData = await getLocationById(locationId, 'reviews')
    return locationData
  },
)

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    isLoading: false,
    location: null,
    locationId: null,
  },
  reducers: {
    clearLocation: (state) => {
      state.isLoading = false
      state.location = null
      state.locationId = null
    },
    setNewLocation: (state) => {
      state.isLoading = false
      state.location = null
      state.locationId = 'new'
    },
  },
  extraReducers: {
    [fetchLocationData.pending]: (state, action) => {
      state.location = null
      state.locationId = parseInt(action.meta.arg.locationId)
      state.isLoading = true
    },
    [fetchLocationData.fulfilled]: (state, action) => {
      state.isLoading = false
      // Accept the fetch if it's the most recent 'pending' one
      if (state.locationId === parseInt(action.payload.id)) {
        state.location = action.payload
      }
    },
    [fetchLocationData.rejected]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = null
      toast.error(`Error fetching location data: ${action.meta.arg}`)
    },
    [fetchReviewData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = parseInt(action.payload.location_id)
    },
  },
})

export const { setNewLocation, clearLocation } = locationSlice.actions

export default locationSlice.reducer
