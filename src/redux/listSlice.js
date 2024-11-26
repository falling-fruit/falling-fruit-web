import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations, getLocationsCount } from '../utils/api'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'
import { updateLastMapView } from './viewportSlice'

const fetchListLocations = createAsyncThunk(
  'list/fetchListLocations',
  async ({ offset, fetchCount = false, extend = false }, { getState }) => {
    const state = getState()
    const { types, muni, invasive } = state.filter
    const { lastMapView } = state.viewport
    const { bounds, zoom, center } = lastMapView
    const params = selectParams(
      { types, muni, invasive, bounds, zoom, center },
      { limit: 100, offset, photo: true },
    )
    return {
      offset,
      extend,
      locations: await getLocations(params),
      ...(fetchCount && (await getLocationsCount(params))),
    }
  },
)

export const fetchListLocationsStart = () =>
  fetchListLocations({ fetchCount: true, offset: 0 })
export const fetchListLocationsExtend = (locations) =>
  fetchListLocations({ offset: locations.length, extend: true })

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    isLoading: false,
    totalCount: null,
    offset: 0,
    shouldFetchNewLocations: true,
    locations: [],
    locationsByIds: [],
    lastMapView: null,
  },
  reducers: {},
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
      state.shouldFetchNewLocations = false
    },
    [updateSelection.type]: (state) => {
      state.shouldFetchNewLocations = true
    },
    [updateLastMapView]: (state) => {
      state.shouldFetchNewLocations = true
    },
  },
})

export default listSlice.reducer
