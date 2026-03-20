import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import {
  addList as apiAddList,
  addLocationToList as apiAddLocationToList,
  editList as apiEditList,
  getListsWithLocations as apiGetLists,
  removeList as apiRemoveList,
  removeLocationFromList as apiRemoveLocationFromList,
} from '../utils/api'

const initialState = {
  lists: [],
  isLoading: false,
  loadingLists: {},
}

// Fetch all lists (with embedded locations) from the backend
export const fetchLists = createAsyncThunk('save/fetchLists', async () => {
  const lists = await apiGetLists()
  return lists
})

// Add a new named list
// Payload: { name: string }
export const addList = createAsyncThunk('save/addList', async ({ name }) => {
  await apiAddList({ name })
  const lists = await apiGetLists()
  return lists
})

// Remove a list by id
// Payload: { listId: number }
export const removeList = createAsyncThunk(
  'save/removeList',
  async ({ listId }) => {
    await apiRemoveList(listId)
    const lists = await apiGetLists()
    return lists
  },
)

// Rename an existing list
// Payload: { listId: number, newName: string }
export const renameList = createAsyncThunk(
  'save/renameList',
  async ({ listId, newName }) => {
    await apiEditList(listId, { name: newName })
    const lists = await apiGetLists()
    return lists
  },
)

// Add a location to a list
// Payload: { listId: number, locationId: number }
export const addLocationToList = createAsyncThunk(
  'save/addLocationToList',
  async ({ listId, locationId }) => {
    await apiAddLocationToList(Number(locationId), listId)
    const updatedLists = await apiGetLists()
    return updatedLists
  },
)

// Remove a location from a list
// Payload: { listId: number, locationId: number }
export const removeLocationFromList = createAsyncThunk(
  'save/removeLocationFromList',
  async ({ listId, locationId }) => {
    await apiRemoveLocationFromList(Number(locationId), listId)
    const updatedLists = await apiGetLists()
    return updatedLists
  },
)

const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {},
  extraReducers: {
    // fetchLists
    [fetchLists.pending]: (state) => {
      state.isLoading = true
    },
    [fetchLists.fulfilled]: (state, action) => {
      state.isLoading = false
      state.lists = action.payload
    },
    [fetchLists.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(
        i18next.t('error_message.api.fetch_location_lists_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },

    [addList.pending]: (state) => {
      state.isLoading = true
    },
    [addList.fulfilled]: (state, action) => {
      state.isLoading = false
      state.lists = action.payload
    },
    [addList.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(
        i18next.t('error_message.api.add_location_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },

    [removeList.pending]: (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    },
    [removeList.fulfilled]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    },
    [removeList.rejected]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      toast.error(
        i18next.t('error_message.api.remove_location_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },

    [renameList.pending]: (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    },
    [renameList.fulfilled]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    },
    [renameList.rejected]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      toast.error(
        i18next.t('error_message.api.rename_location_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },

    // addLocationToList
    [addLocationToList.pending]: (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    },
    [addLocationToList.fulfilled]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    },
    [addLocationToList.rejected]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      toast.error(
        i18next.t('error_message.api.add_location_to_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },

    // removeLocationFromList
    [removeLocationFromList.pending]: (state, action) => {
      const { listId } = action.meta.arg
      state.loadingLists[listId] = true
    },
    [removeLocationFromList.fulfilled]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      state.lists = action.payload
    },
    [removeLocationFromList.rejected]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.loadingLists[listId]
      toast.error(
        i18next.t('error_message.api.remove_location_from_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
  },
})

export default saveSlice.reducer
