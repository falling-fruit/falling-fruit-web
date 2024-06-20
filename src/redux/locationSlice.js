import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { getLocationById } from '../utils/api'

export const fetchLocationData = createAsyncThunk(
  'locations/fetchLocationData',
  async (locationId) => {
    const locationData = await getLocationById(locationId, 'reviews')
    return locationData
  },
)

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    locationId: null,
    isLoading: false,
    location: null,
  },
  reducers: {
    setNewLocation: (state) => {
      state.locationId = 'new'
      state.isLoading = false
      state.location = null
    },
    clearLocation: (state) => {
      state.locationId = null
      state.isLoading = false
      state.location = null
    },
  },
  extraReducers: {
    [fetchLocationData.pending]: (state) => {
      state.isLoading = true
    },
    [fetchLocationData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.location = action.payload
    },
    [fetchLocationData.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(`Error fetching location data: ${action.payload}`)
    },
  },
})

export const { setNewLocation, clearLocation } = locationSlice.actions

export default locationSlice.reducer
