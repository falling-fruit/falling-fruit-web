import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations, getLocationsCount } from '../utils/api'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'
import { updateLastMapView } from './viewportSlice'

const fetchListLocations = createAsyncThunk(
  'list/fetchListLocations',
  async ({ offset, fetchCount }, { getState }) => {
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
      locations: await getLocations(params),
      ...(fetchCount && (await getLocationsCount(params))),
    }
  },
)

export const fetchListLocationsStart = () =>
  fetchListLocations({ fetchCount: true, offset: 0 })
export const fetchListLocationsExtend = (locations) =>
  fetchListLocations({ fetchCount: false, offset: locations.length })

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    isLoading: false,
    totalCount: null,
    shouldFetchNewLocations: true,
    locations: [],
    lastMapView: null,
  },
  reducers: {},
  extraReducers: {
    [fetchListLocations.pending]: (state) => {
      state.shouldFetchNewLocations = false
      state.isLoading = true
    },
    [fetchListLocations.fulfilled]: (state, action) => {
      const { offset, locations, count } = action.payload

      if (offset > 0) {
        state.locations.push(...locations)
      } else {
        state.locations = locations
      }

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
