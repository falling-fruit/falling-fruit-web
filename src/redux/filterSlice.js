import { createSlice } from '@reduxjs/toolkit'

/*
export const fetchFilterCounts = createAsyncThunk(
  'map/fetchFilterCounts',
  async (_, { getState }) => {

  },
)
*/

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    treeData: null,
    types: [],
    muni: true,
    invasive: false,
  },
  reducers: {
    setFilters: (_state, action) => action.payload,
  },
})

export const { setFilters } = filterSlice.actions

export default filterSlice.reducer
