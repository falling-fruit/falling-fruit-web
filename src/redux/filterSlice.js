import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'

import { getTypeCounts } from '../utils/api'
import isNetworkError from '../utils/isNetworkError'
import { selectParams } from './selectParams'
import { fetchAndLocalizeTypes } from './typeSlice'
import { updateSelection } from './updateSelection'

export const fetchFilterCounts = createAsyncThunk(
  'map/fetchFilterCounts',
  async (_, { getState }) => {
    const state = getState()
    const { lastMapView } = state.viewport
    const isOpen =
      state.filter.isOpenInMobileLayout ||
      state.misc.isDesktop ||
      (state.misc.isEmbed && window.location.pathname.startsWith('/filters'))
    if (isOpen && lastMapView) {
      const { muni } = state.filter
      const { bounds, zoom, center: _ } = lastMapView
      const counts = await getTypeCounts(
        // Match zoom level used in getClusters
        // Wojtek: not sure why?
        selectParams({
          types: undefined,
          muni,
          bounds,
          zoom: zoom + 1,
          center: undefined,
        }),
      )

      return {
        counts,
        isFromApiSource: true,
      }
    } else {
      return {
        counts: [],
        isFromApiSource: false,
      }
    }
  },
)

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    types: null,
    muni: true,
    isOpenInMobileLayout: false,
    isLoading: false,
    fetchError: null,
    countsById: {},
    showOnlyOnMap: true,
  },
  reducers: {
    openFilter: (state) => {
      state.isOpenInMobileLayout = true
    },
    closeFilter: (state) => {
      state.isOpenInMobileLayout = false
    },
    setShowOnlyOnMap: (state, action) => {
      state.showOnlyOnMap = action.payload
    },
  },
  extraReducers: {
    [fetchFilterCounts.pending]: (state) => {
      state.isLoading = true
    },
    [fetchFilterCounts.fulfilled]: (state, action) => {
      const { counts } = action.payload

      const countsById = {}
      for (const count of counts) {
        countsById[count.id] = count.count
      }

      state.countsById = countsById
      state.isLoading = false
      state.fetchError = null
    },
    [fetchFilterCounts.rejected]: (state, action) => {
      state.isLoading = false
      state.fetchError = i18next.t(
        'error_message.api.fetch_filter_counts_failed',
        {
          message: isNetworkError(action.error)
            ? i18next.t('error_message.connectivity.you_are_offline')
            : action.error.message || i18next.t('error_message.unknown_error'),
        },
      )
    },

    [updateSelection]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [fetchAndLocalizeTypes.fulfilled]: (state, action) => {
      const { typesAccess } = action.payload
      if (state.types === null) {
        state.types = typesAccess
          .selectableTypesWithCategories('forager', 'freegan')
          .map((t) => t.id)
      }
    },
  },
})

export const { openFilter, closeFilter, setShowOnlyOnMap } = filterSlice.actions

export default filterSlice.reducer
