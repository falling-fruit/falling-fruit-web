import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getLocations, getLocationsCount } from '../utils/api'
import { parseUrl } from '../utils/getInitialUrl'
import { getZoomedOutView } from '../utils/viewportBounds'
import { viewChange } from './mapSlice'
import { selectParams } from './selectParams'
import { updateSelection } from './updateSelection'

// We usually show a list corresponding to a previously seen map view
// but we want to be able to show a list on first load if e.g. a page is refreshed
// so approximate a view
const { _, ...initialView } = parseUrl()
// TODO not correct, because the zoom level is actually specified in the URL :)
initialView.bounds = getZoomedOutView(
  initialView.center.lat,
  initialView.center.lng,
)

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
    view: initialView,
    shouldFetchNewLocations: false,
    locations: [],
  },
  reducers: {
    clearListLocations: (state) => {
      state.locations = []
    },
  },
  extraReducers: {
    [viewChange.type]: (state, action) => {
      // When the map changes, sync the center+zoom+bounds setup
      // so the list view corresponds to what the user just saw
      state.view = action.payload
    },

    [fetchListLocations.pending]: (state) => {
      state.shouldFetchNewLocations = false
      state.isLoading = true
    },
    [fetchListLocations.rejected]: (state) => {
      // temporary aid for #347
      console.log('fetchListLocations.rejected', state)
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

export const { clearListLocations } = listSlice.actions

export default listSlice.reducer
