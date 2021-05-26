import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getTypes } from '../utils/api'
import { setReducer } from './mapSlice'

export const fetchAllTypes = createAsyncThunk(
  'misc/fetchAllTypes',
  async () => await getTypes(),
)

export const miscSlice = createSlice({
  name: 'misc',
  initialState: {
    typesById: null,
    isDesktop: null,
  },
  reducers: {
    setIsDesktop: setReducer('isDesktop'),
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

export const { setIsDesktop } = miscSlice.actions

export default miscSlice.reducer
