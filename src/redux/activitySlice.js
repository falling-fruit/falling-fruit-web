import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { getLocationsChanges } from '../utils/api'

const fetchLocationChanges = createAsyncThunk(
  'activity/fetchLocationChanges',
  getLocationsChanges,
)

export const fetchMoreLocationChanges = () => (dispatch, getState) => {
  const state = getState()
  const latest = state.activity.fetchedUntilDate || new Date().toISOString()
  const earliest = new Date(
    new Date(latest).getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString()
  return dispatch(fetchLocationChanges({ earliest, latest, offset: 0 }))
}

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    isLoading: false,
    locationChanges: [],
    fetchedUntilDate: null,
    anchorElementId: null,
  },
  reducers: {
    setAnchorElementId: (state, action) => {
      state.anchorElementId = action.payload
    },
  },
  extraReducers: {
    [fetchLocationChanges.pending]: (state) => {
      state.isLoading = true
    },
    [fetchLocationChanges.fulfilled]: (state, action) => {
      const { earliest } = action.meta.arg

      state.locationChanges.push(...action.payload)
      state.fetchedUntilDate = state.fetchedUntilDate
        ? new Date(
            Math.min(new Date(state.fetchedUntilDate), new Date(earliest)),
          ).toISOString()
        : earliest

      state.isLoading = false
    },
    [fetchLocationChanges.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(
        i18next.t('error_message.api.fetch_location_changes_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
  },
})

export const { setAnchorElementId } = activitySlice.actions

export default activitySlice.reducer
