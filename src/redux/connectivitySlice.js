import { createSlice } from '@reduxjs/toolkit'

import isNetworkError from '../utils/isNetworkError'
import { fetchFilterCounts } from './filterSlice'
import { fetchListLocations } from './listSlice'
import { fetchMapClusters, fetchMapLocations } from './mapSlice'

export const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState: {
    isOffline: false,
  },
  reducers: {},
  extraReducers: {
    [fetchMapLocations.rejected]: (state, action) => {
      if (isNetworkError(action.error)) {
        state.isOffline = true
      }
    },
    [fetchMapClusters.rejected]: (state, action) => {
      if (isNetworkError(action.error)) {
        state.isOffline = true
      }
    },
    [fetchListLocations.rejected]: (state, action) => {
      if (isNetworkError(action.error)) {
        state.isOffline = true
      }
    },
    [fetchFilterCounts.rejected]: (state, action) => {
      if (isNetworkError(action.error)) {
        state.isOffline = true
      }
    },
    [fetchMapLocations.fulfilled]: (state) => {
      state.isOffline = false
    },
    [fetchMapClusters.fulfilled]: (state) => {
      state.isOffline = false
    },
    [fetchListLocations.fulfilled]: (state) => {
      state.isOffline = false
    },
    [fetchFilterCounts.fulfilled]: (state, action) => {
      if (action.payload.isFromApiSource) {
        state.isOffline = false
      }
    },
  },
})

export default connectivitySlice.reducer
