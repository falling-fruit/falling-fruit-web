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
  },
  reducers: {
    layoutChange: (state, action) => {
      state.isDesktop = action.payload.isDesktop
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

export const { layoutChange } = miscSlice.actions

export default miscSlice.reducer
