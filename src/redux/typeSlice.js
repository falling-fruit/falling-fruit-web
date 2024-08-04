import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { addType, getTypes } from '../utils/api'
import { typesAccessInLanguage } from '../utils/localizedTypes'

export const fetchAndLocalizeTypes = createAsyncThunk(
  'type/fetchAndLocalizeTypes',
  async (language) => {
    const types = await getTypes()
    return typesAccessInLanguage(types, language)
  },
)

export const addTypeAndUpdate = createAsyncThunk(
  'type/addTypeAndUpdate',
  async ({ submitData, language, locationId }) => {
    const response = await addType(submitData)
    return { ...response, language, locationId }
  },
)

const typeSlice = createSlice({
  name: 'type',
  initialState: {
    isLoading: false,
    typesAccess: typesAccessInLanguage([], ''),
    recentlyAddedTypesByLocation: {},
    isAddTypeModalOpen: false,
  },
  reducers: {
    openAddTypeModal: (state) => {
      state.isAddTypeModalOpen = true
    },
    closeAddTypeModal: (state) => {
      state.isAddTypeModalOpen = false
    },
  },
  extraReducers: {
    [fetchAndLocalizeTypes.pending]: (state) => {
      state.isLoading = true
    },
    [fetchAndLocalizeTypes.fulfilled]: (state, action) => {
      state.typesAccess = action.payload
      state.isLoading = false
    },
    [addTypeAndUpdate.fulfilled]: (state, action) => {
      const { id, language, locationId } = action.payload
      state.typesAccess = state.typesAccess.addType(action.payload, language)
      toast.success('New type added successfully!')
      if (!state.recentlyAddedTypesByLocation[locationId]) {
        state.recentlyAddedTypesByLocation[locationId] = []
      }
      state.recentlyAddedTypesByLocation[locationId].push(id)
      state.isAddTypeModalOpen = false
    },
    [addTypeAndUpdate.rejected]: () => {
      toast.error('Failed to add new type. Please try again.')
    },
  },
})

export const { openAddTypeModal, closeAddTypeModal } = typeSlice.actions

export default typeSlice.reducer
