import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations } from '../utils/api'
import { selectParams } from './selectParams'

export const fetchListLocations = createAsyncThunk(
  'map/fetchListLocations',
  async (offset, { getState }) =>
    await getLocations(selectParams(getState(), { limit: 30, offset }, true)),
)

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    isLoading: false,
    locations: [],
  },
  extraReducers: {
    [fetchListLocations.pending]: (state) => {
      state.isLoading = true
    },
    [fetchListLocations.fulfilled]: (state, action) => {
      state.locations = action.payload
      state.isLoading = false
    },
  },
})

export default listSlice.reducer
