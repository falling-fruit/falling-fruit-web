import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../components/map/MapPage'
import { getTypeCounts } from '../utils/api'
import { buildTypeSchema } from '../utils/buildTypeSchema'
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
    isOpen: false,
    isLoading: false,
  },
  reducers: {
    setFilters: (state, action) => ({ ...state, ...action.payload }),
    openFilter: (state) => {
      state.isOpen = true
    },
    closeFilter: (state) => {
      state.isOpen = false
    },
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
        countsById,
        state.types,
        showScientificNames,
      )
      state.isLoading = false
    },
  },
})

export const {
  setFilters,
  openFilter,
  closeFilter,
  updateSelection,
} = filterSlice.actions

export const openFilterAndFetch = () => (dispatch, getState) => {
  const state = getState()
  dispatch(openFilter())

  if (state.map.view.zoom > VISIBLE_CLUSTER_ZOOM_LIMIT) {
    dispatch(fetchFilterCounts())
  }
}

export const selectionChanged = (types) => (dispatch) => {
  dispatch(updateSelection(types))
  dispatch(fetchLocations())
}

export default filterSlice.reducer
