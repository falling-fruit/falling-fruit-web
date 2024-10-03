import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getTypeCounts } from '../utils/api'
import { selectParams } from './selectParams'
import { fetchAndLocalizeTypes } from './typeSlice'
import { updateSelection } from './updateSelection'

export const fetchFilterCounts = createAsyncThunk(
  'map/fetchFilterCounts',
  async (_, { getState }) => {
    const state = getState()
    const { lastMapView } = state.viewport
    const isOpen = state.filter.isOpenInMobileLayout || state.misc.isDesktop
    if (isOpen && lastMapView) {
      const { muni, invasive } = state.filter
      const { bounds, zoom, center: _ } = lastMapView
      const counts = await getTypeCounts(
        // Match zoom level used in getClusters
        // Wojtek: not sure why?
        selectParams({
          types: undefined,
          muni,
          invasive,
          bounds,
          zoom: zoom + 1,
          center: undefined,
        }),
      )

      return {
        counts,
      }
    } else {
      return {
        counts: [],
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
    invasive: false,
    isLoading: false,
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
    },

    [updateSelection]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [fetchAndLocalizeTypes.fulfilled]: (state, action) => {
      const typesAccess = action.payload
      state.types = typesAccess.selectableTypes().map((t) => t.id)
    },
  },
})

export const { openFilter, closeFilter } = filterSlice.actions

export default filterSlice.reducer
