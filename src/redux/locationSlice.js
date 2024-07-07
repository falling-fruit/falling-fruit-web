import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { getLocationById } from '../utils/api'
import { fetchReviewData } from './reviewSlice'

export const fetchLocationData = createAsyncThunk(
  'locations/fetchLocationData',
  async ({ locationId, isBeingEdited: _ }) => {
    const locationData = await getLocationById(locationId, 'reviews')
    return locationData
  },
)

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    isLoading: false,
    location: null,
    position: null, // {lat: number, lng: number}
    locationId: null,
    isBeingEdited: false,
    form: null,
  },
  reducers: {
    clearLocation: (state) => {
      state.isLoading = false
      state.location = null
      state.locationId = null
      state.position = null
      state.isBeingEdited = false
      state.form = null
    },
    initNewLocation: (state, action) => {
      state.isLoading = false
      state.location = null
      state.isBeingEdited = false
      if (state.locationId !== 'new') {
        state.locationId = 'new'
        state.position = action.payload
      }
      state.form = null
    },
    updatePosition: (state, action) => {
      state.position = action.payload
    },
    saveFormValues: (state, action) => {
      state.form = action.payload
    },
    setIsBeingEditedAndResetPosition: (state, action) => {
      state.isBeingEdited = action.payload
      if (state.location) {
        state.position = { lat: state.location.lat, lng: state.location.lng }
      }
    },
  },
  extraReducers: {
    [fetchLocationData.pending]: (state, action) => {
      state.location = null
      state.locationId = parseInt(action.meta.arg.locationId)
      state.isLoading = true
      state.position = null
      state.isBeingEdited = action.meta.arg.isBeingEdited
      state.form = null
    },
    [fetchLocationData.fulfilled]: (state, action) => {
      state.isLoading = false
      // Accept the fetch if it's the most recent 'pending' one
      if (state.locationId === parseInt(action.payload.id)) {
        state.location = action.payload
        state.position = { lat: action.payload.lat, lng: action.payload.lng }
      }
    },
    [fetchLocationData.rejected]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = null
      state.position = null
      state.isBeingEdited = false
      toast.error(`Error fetching location data: ${action.meta.arg}`)
    },
    [fetchReviewData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = parseInt(action.payload.location_id)
      state.position = null
      state.isBeingEdited = false
    },
  },
})

export const {
  initNewLocation,
  clearLocation,
  updatePosition,
  saveFormValues,
  setIsBeingEditedAndResetPosition,
} = locationSlice.actions

export default locationSlice.reducer
