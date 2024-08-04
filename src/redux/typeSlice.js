import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getTypes } from '../utils/api'
import { typesAccessInLanguage } from '../utils/localizedTypes'

export const fetchAndLocalizeTypes = createAsyncThunk(
  'type/fetchAndLocalizeTypes',
  async (language) => {
    const types = await getTypes()
    return typesAccessInLanguage(types, language)
  },
)
const typeSlice = createSlice({
  name: 'type',
  initialState: {
    isLoading: false,
    typesAccess: typesAccessInLanguage([], ''),
  },
  reducers: {},
  extraReducers: {
    [fetchAndLocalizeTypes.pending]: (state) => {
      state.isLoading = true
    },
    [fetchAndLocalizeTypes.fulfilled]: (state, action) => {
      state.typesAccess = action.payload
      state.isLoading = false
    },
  },
})
export default typeSlice.reducer
