import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { getLocationsChanges } from '../utils/api'
import {
  addNewLocation,
  addNewReview,
  deleteExistingLocation,
  deleteLocationReview,
  editExistingLocation,
  editExistingReview,
} from './locationSlice'

const fetchLocationChangesUser = createAsyncThunk(
  'activity/fetchLocationChangesUser',
  getLocationsChanges,
)

const fetchLocationChangesInitial = createAsyncThunk(
  'activity/fetchLocationChangesInitial',
  getLocationsChanges,
)

const fetchLocationChangesMore = createAsyncThunk(
  'activity/fetchLocationChangesMore',
  getLocationsChanges,
)

const fetchLocationChangesLatest = createAsyncThunk(
  'activity/fetchLocationChangesLatest',
  getLocationsChanges,
)

export const getUserActivity =
  (userId, isCurrentUser) => (dispatch, getState) => {
    const state = getState()
    const { changesByUser, currentUserActivityIsStale } = state.activity
    const data = changesByUser[userId]

    if (data && !currentUserActivityIsStale) {
      return Promise.resolve(data)
    } else {
      return dispatch(fetchLocationChangesUser({ user_id: userId })).then(
        (result) => {
          if (isCurrentUser) {
            dispatch(clearCurrentUserActivityStale())
          }
          return result
        },
      )
    }
  }

/**
 * Fetches the first page of changes when the page is first loaded.
 */
export const fetchInitialLocationChanges = () => (dispatch, getState) => {
  const state = getState()
  const { isLoading, data } = state.activity.recentChanges

  if (isLoading || data.length > 0) {
    return Promise.resolve()
  }

  const latest = new Date().toISOString()
  const earliest = new Date(
    new Date(latest).getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString()

  return dispatch(fetchLocationChangesInitial({ earliest, latest }))
}

/**
 * Fetches the next page of older changes when the user scrolls to the bottom.
 */
export const fetchMoreLocationChanges = () => (dispatch, getState) => {
  const state = getState()
  const { isLoading, fetchedUntilDate } = state.activity.recentChanges

  if (isLoading || !fetchedUntilDate) {
    return Promise.resolve()
  }

  const latest = fetchedUntilDate
  const earliest = new Date(
    new Date(latest).getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString()

  return dispatch(fetchLocationChangesMore({ earliest, latest }))
}

/**
 * Fetches changes from now back to just after the most recent already-fetched
 * change. The earliest parameter is inclusive, so we add 1 second (the
 * smallest unit in the YYYY-MM-DDTHH:MM:SSZ format) to the timestamp of the
 * most recent change to avoid re-fetching it.
 */
export const fetchLatestLocationChanges = () => (dispatch, getState) => {
  const state = getState()
  const { data, isLoadingLatest } = state.activity.recentChanges

  if (data.length === 0 || isLoadingLatest) {
    return Promise.resolve()
  }

  const mostRecentDate = data.reduce((latest, change) => {
    const changeDate = new Date(change.created_at)
    return changeDate > latest ? changeDate : latest
  }, new Date(0))

  const earliest = new Date(mostRecentDate.getTime() + 1000).toISOString()
  const latest = new Date().toISOString()

  return dispatch(fetchLocationChangesLatest({ earliest, latest }))
}

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    recentChanges: {
      data: [],
      isLoading: false,
      isLoadingLatest: false,
      fetchedUntilDate: null,
      isStale: false,
      lastBrowsedSection: {
        id: null,
      },
    },
    changesByUser: {},
    currentUserActivityIsStale: false,
    userActivityLastBrowsedSection: {
      id: null,
      userId: null,
      displayLimit: null,
    },
  },
  reducers: {
    setRecentChangesLastBrowsedSection: (state, action) => {
      state.recentChanges.lastBrowsedSection = action.payload
    },
    setUserActivityLastBrowsedSection: (state, action) => {
      state.userActivityLastBrowsedSection = action.payload
    },
    clearCurrentUserActivityStale: (state) => {
      state.currentUserActivityIsStale = false
    },
  },
  extraReducers: {
    [fetchLocationChangesUser.fulfilled]: (state, action) => {
      const { user_id: userId } = action.meta.arg
      state.changesByUser[userId] = action.payload
    },
    [fetchLocationChangesInitial.pending]: (state) => {
      state.recentChanges.isLoading = true
    },
    [fetchLocationChangesInitial.fulfilled]: (state, action) => {
      const { earliest } = action.meta.arg
      state.recentChanges.data.push(...action.payload)
      state.recentChanges.fetchedUntilDate = earliest
      state.recentChanges.isLoading = false
      state.recentChanges.isStale = false
    },
    [fetchLocationChangesInitial.rejected]: (state, action) => {
      state.recentChanges.isLoading = false
      toast.error(
        i18next.t('error_message.api.fetch_location_changes_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [fetchLocationChangesMore.pending]: (state) => {
      state.recentChanges.isLoading = true
    },
    [fetchLocationChangesMore.fulfilled]: (state, action) => {
      const { earliest } = action.meta.arg
      state.recentChanges.data.push(...action.payload)
      state.recentChanges.fetchedUntilDate = new Date(
        Math.min(
          new Date(state.recentChanges.fetchedUntilDate),
          new Date(earliest),
        ),
      ).toISOString()
      state.recentChanges.isLoading = false
      state.recentChanges.isStale = false
    },
    [fetchLocationChangesMore.rejected]: (state, action) => {
      state.recentChanges.isLoading = false
      toast.error(
        i18next.t('error_message.api.fetch_location_changes_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [fetchLocationChangesLatest.pending]: (state) => {
      state.recentChanges.isLoadingLatest = true
    },
    [fetchLocationChangesLatest.fulfilled]: (state, action) => {
      state.recentChanges.data.unshift(...action.payload)
      state.recentChanges.isLoadingLatest = false
      state.recentChanges.isStale = false
    },
    [fetchLocationChangesLatest.rejected]: (state, action) => {
      state.recentChanges.isLoadingLatest = false
      toast.error(
        i18next.t('error_message.api.fetch_location_changes_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [addNewLocation.fulfilled]: (state) => {
      state.currentUserActivityIsStale = true
    },
    [editExistingLocation.fulfilled]: (state) => {
      state.currentUserActivityIsStale = true
    },
    [addNewReview.fulfilled]: (state) => {
      state.currentUserActivityIsStale = true
    },
    [editExistingReview.fulfilled]: (state) => {
      state.currentUserActivityIsStale = true
    },
    [deleteLocationReview.fulfilled]: (state) => {
      state.recentChanges.data = []
      state.recentChanges.isStale = true
      state.currentUserActivityIsStale = true
    },
    [deleteExistingLocation.fulfilled]: (state) => {
      state.recentChanges.data = []
      state.recentChanges.isStale = true
      state.currentUserActivityIsStale = true
    },
  },
})

export const resetRecentChangesLastBrowsedSection = () =>
  setRecentChangesLastBrowsedSection({
    id: null,
  })

export const resetUserActivityLastBrowsedSection = () =>
  setUserActivityLastBrowsedSection({
    id: null,
    userId: null,
    displayLimit: null,
  })

export const {
  setRecentChangesLastBrowsedSection,
  setUserActivityLastBrowsedSection,
  clearCurrentUserActivityStale,
} = activitySlice.actions

export default activitySlice.reducer
