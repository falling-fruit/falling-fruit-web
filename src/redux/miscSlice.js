import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getTypes } from '../utils/api'

export const fetchAllTypes = createAsyncThunk(
  'misc/fetchAllTypes',
  async () => await getTypes(),
)

export const miscSlice = createSlice({
  name: 'misc',
  initialState: {
    typesById: {},
    isDesktop: null,
    locationsWithoutPanorama: {},
  },
  reducers: {
    layoutChange: (state, action) => {
      state.isDesktop = action.payload.isDesktop
    },
    addLocationWithoutPanorama: (state, action) => {
      state.locationsWithoutPanorama[action.payload] = true
    },
  },
  extraReducers: {
    [fetchAllTypes.fulfilled]: (state, action) => {
      const typesById = {}
      for (const type of action.payload) {
        typesById[type.id] = type
      }

      state.typesById = typesById
    },
  },
})

export const { addLocationWithoutPanorama, layoutChange } = miscSlice.actions

export default miscSlice.reducer
