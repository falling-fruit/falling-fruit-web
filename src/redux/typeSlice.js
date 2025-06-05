import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import { addType, getTypes } from '../utils/api'
import { typesAccessInLanguage } from '../utils/localizedTypes'
import TypeShareEncoder from '../utils/typeShareEncoder'

export const fetchAndLocalizeTypes = createAsyncThunk(
  'type/fetchAndLocalizeTypes',
  async (language) => {
    const types = await getTypes()
    const typesAccess = typesAccessInLanguage(types, language)
    const typeEncoder = new TypeShareEncoder(typesAccess)
    return { typesAccess, typeEncoder }
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
    const typeEncoder = new TypeShareEncoder(updatedTypesAccess)
    return {
      newMenuEntry: updatedTypesAccess.getMenuEntry(response.id),
      updatedTypesAccess,
      typeEncoder,
    }
  },
)

const typeSlice = createSlice({
  name: 'type',
  initialState: {
    isLoading: false,
    typesAccess: typesAccessInLanguage([], ''),
    typeEncoder: new TypeShareEncoder(typesAccessInLanguage([], '')),
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
      state.typesAccess = action.payload.typesAccess
      state.typeEncoder = action.payload.typeEncoder
      state.isLoading = false
    },
    [addTypeAndUpdate.fulfilled]: (state, action) => {
      state.typesAccess = action.payload.updatedTypesAccess
      state.typeEncoder = action.payload.typeEncoder
      toast.success(i18next.t('success_message.type_added'))
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
