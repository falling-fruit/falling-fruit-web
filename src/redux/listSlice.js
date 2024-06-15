import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations, getLocationsCount } from '../utils/api'
import { selectPlace, setReducer, viewChange } from './mapSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

export const fetchListLocations = createAsyncThunk(
  'list/fetchListLocations',
  async ({ offset, fetchCount = false, extend = false }, { getState }) => {
    const params = selectParams(
      getState(),
      { limit: 100, offset, photo: true },
      false,
    )

    return {
      offset,
      extend,
      locations: await getLocations(params),
      ...(fetchCount && (await getLocationsCount(params))),
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
    clearListLocations: (state) => {
      state.locations = []
    },
  },
  extraReducers: {
    [viewChange.type]: (state, action) => {
      if (state.updateOnMapMove || state.isViewSearched) {
        // If updateOnMapMove flag/checkbox is unchecked, then the list view is only updated when a new location is "searched"
        state.view = action.payload
        state.shouldFetchNewLocations = true
      }
      state.isViewSearched = false
    },

    [selectPlace]: (state) => {
      state.isViewSearched = true
    },

    [fetchListLocations.pending]: (state) => {
      state.shouldFetchNewLocations = false
      state.isLoading = true
    },
    [fetchListLocations.fulfilled]: (state, action) => {
      const { extend, offset, locations, count } = action.payload

      if (extend) {
        state.locations.push(...locations)
      } else {
        state.locations = locations
      }

      state.offset = offset
      if (count !== undefined) {
        state.totalCount = count
      }

      state.isLoading = false
    },

    [updateSelection.type]: (state) => {
      state.shouldFetchNewLocations = true
    },
  },
})

export const { setUpdateOnMapMove, clearListLocations } = listSlice.actions

export default listSlice.reducer
