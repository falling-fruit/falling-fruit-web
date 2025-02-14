import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
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
    [addTypeAndUpdate.rejected]: (_state, action) => {
      toast.error(
        i18next.t('error_message.api.type_add_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
  },
})

export const { openAddTypeModal, closeAddTypeModal } = typeSlice.actions

export default typeSlice.reducer
