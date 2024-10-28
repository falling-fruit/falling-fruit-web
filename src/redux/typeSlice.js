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
  async ({ submitData, language }, { getState }) => {
    const response = await addType(submitData)
    const state = getState()
    const updatedTypesAccess = state.type.typesAccess.addType(
      response,
      language,
    )
    return {
      newMenuEntry: updatedTypesAccess.getMenuEntry(response.id),
      updatedTypesAccess,
    }
  },
)

const typeSlice = createSlice({
  name: 'type',
  initialState: {
    isLoading: false,
    typesAccess: typesAccessInLanguage([], ''),
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
      state.typesAccess = action.payload.updatedTypesAccess
      toast.success('New type added successfully!')
      state.isAddTypeModalOpen = false
    },
    [addTypeAndUpdate.rejected]: () => {
      toast.error('Failed to add new type. Please try again.')
    },
  },
})

export const { openAddTypeModal, closeAddTypeModal } = typeSlice.actions

export default typeSlice.reducer
