import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations } from '../utils/api'
import { setReducer, setView } from './mapSlice'
import { searchView } from './searchView'
import { selectParams } from './selectParams'

export const fetchListLocations = createAsyncThunk(
  'list/fetchListLocations',
  async ({ offset, fetchCount = false, extend = false }, { getState }) => {
    const params = selectParams(getState(), { limit: 30, offset }, false)

    return {
      offset,
      extend,
      locations: await getLocations(params),
      ...(fetchCount && { totalCount: 100 }), // await getLocationsCount(params) }),
    }
  },
)

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    isLoading: false,
    totalCount: null,
    offset: 0,
    view: null, // Represents what view is used for the list
    isViewSearched: false,
    shouldFetchNewLocations: false,
    updateOnMapMove: true,
    locations: [],
  },
  reducers: {
    setUpdateOnMapMove: setReducer('updateOnMapMove'),
  },
  extraReducers: {
    [setView.type]: (state, action) => {
      if (state.updateOnMapMove || state.isViewSearched) {
        // If updateOnMapMove flag/checkbox is unchecked, then the list view is only updated when a new location is "searched"
        state.view = action.payload
        state.shouldFetchNewLocations = true
      }
      state.isViewSearched = false
    },

    [searchView.type]: (state) => {
      state.isViewSearched = true
    },

    [fetchListLocations.pending]: (state) => {
      state.shouldFetchNewLocations = false
      state.isLoading = true
    },
    [fetchListLocations.fulfilled]: (state, action) => {
      const { extend, offset, locations, totalCount } = action.payload

      if (extend) {
        state.locations.push(...locations)
      } else {
        state.locations = locations
      }

      state.offset = offset
      if (totalCount !== undefined) {
        state.totalCount = totalCount
      }

      state.isLoading = false
    },
  },
})

export const { setUpdateOnMapMove } = listSlice.actions

export default listSlice.reducer
