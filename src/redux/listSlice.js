import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations, getLocationsCount } from '../utils/api'
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
    shouldFetchNewLocations: true,
    locations: [],
  },
  reducers: {
    invalidateListLocations: (state) => {
      state.shouldFetchNewLocations = true
    },
  },
  extraReducers: {
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

export const { invalidateListLocations } = listSlice.actions
export default listSlice.reducer
