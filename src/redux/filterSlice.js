import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getTypeCounts } from '../utils/api'
import { buildTypeSchema } from '../utils/buildTypeSchema'
import { fetchAllTypes } from './miscSlice'
import { selectParams } from './selectParams'
import { fetchLocations } from './viewChange'

export const fetchFilterCounts = createAsyncThunk(
  'map/fetchFilterCounts',
  async (_, { getState }) => {
    const state = getState()
    const { typesById } = state.misc
    const { showScientificNames } = state.settings

    const counts = await getTypeCounts(
      selectParams(state, { types: undefined }),
    )

    return {
      counts,
      typesById,
      showScientificNames,
    }
  },
)

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    treeData: [],
    types: [],
    muni: true,
    invasive: false,
    isLoading: false,
  },
  reducers: {
    setFilters: (state, action) => ({ ...state, ...action.payload }),
    updateSelection: (state, action) => {
      state.types = action.payload
    },
  },
  extraReducers: {
    [fetchFilterCounts.pending]: (state) => {
      state.isLoading = true
    },
    [fetchFilterCounts.fulfilled]: (state, action) => {
      const { counts, typesById, showScientificNames } = action.payload

      const countsById = {}
      for (const count of counts) {
        countsById[count.id] = count.count
      }

      state.treeData = buildTypeSchema(
        Object.values(typesById),
        showScientificNames,
      )
      state.isLoading = false
    },
    [fetchAllTypes.fulfilled]: (state, action) => {
      state.types = action.payload.map((t) => `${t.id}`)
    },
  },
})

export const { setFilters, updateSelection } = filterSlice.actions

export const selectionChanged = (types) => (dispatch) => {
  dispatch(updateSelection(types))
  dispatch(fetchLocations())
}

export default filterSlice.reducer
