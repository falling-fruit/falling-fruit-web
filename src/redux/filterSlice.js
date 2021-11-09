import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getTypeCounts } from '../utils/api'
import {
  buildTypeSchema,
  getChildrenById,
  getScientificNameById,
  getTypesWithPendingCategory,
  PENDING_ID,
} from '../utils/buildTypeSchema'
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
    types: [],
    treeData: [],
    childrenById: {},
    scientificNameById: {},
    muni: true,
    isOpen: false,
    invasive: false,
    isLoading: false,
    countsById: {},
    showOnlyOnMap: false,
  },
  reducers: {
    setFilters: (state, action) => ({ ...state, ...action.payload }),
    updateSelection: (state, action) => {
      state.types = action.payload
    },
    openFilter: (state) => {
      state.isOpen = true
    },
    closeFilter: (state) => {
      state.isOpen = false
    },
  },
  extraReducers: {
    [fetchFilterCounts.pending]: (state) => {
      state.isLoading = true
    },
    [fetchFilterCounts.fulfilled]: (state, action) => {
      const { counts } = action.payload

      const countsById = {}
      for (const count of counts) {
        countsById[count.id] = count.count
      }

      state.countsById = countsById
      state.isLoading = false
    },
    [fetchAllTypes.fulfilled]: (state, action) => {
      const typesWithPendingCategory = getTypesWithPendingCategory([
        ...action.payload,
        {
          id: PENDING_ID,
          parent_id: null,
          name: 'Pending Review',
        },
      ])
      const childrenById = getChildrenById(typesWithPendingCategory)
      state.childrenById = childrenById
      state.treeData = buildTypeSchema(typesWithPendingCategory, childrenById)
      state.scientificNameById = getScientificNameById(action.payload)
      state.types = action.payload.map((t) => `${t.id}`)
    },
  },
})

export const {
  setFilters,
  openFilter,
  closeFilter,
  updateSelection,
} = filterSlice.actions

export const selectionChanged = (types) => (dispatch) => {
  dispatch(updateSelection(types))
  dispatch(fetchLocations())
}

export const openFilterAndFetch = () => (dispatch) => {
  dispatch(openFilter())
  dispatch(fetchFilterCounts())
}

export default filterSlice.reducer
