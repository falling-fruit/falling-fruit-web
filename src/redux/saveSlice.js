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
  isAddingNew: false,
  pendingToggles: {},
}

export const fetchLists = createAsyncThunk('save/fetchLists', async () => {
  const lists = await apiGetLists()
  return lists
})

export const addList = createAsyncThunk('save/addList', async ({ name }) => {
  const newList = await apiAddList({ name })
  return newList
})

export const removeList = createAsyncThunk(
  'save/removeList',
  async ({ listId }) => {
    await apiRemoveList(listId)
    return listId
  },
)

export const renameList = createAsyncThunk(
  'save/renameList',
  async ({ listId, newName }) => {
    await apiEditList(listId, { name: newName, description: null })
    return { listId, newName }
  },
)

export const addLocationToList = createAsyncThunk(
  'save/addLocationToList',
  async ({ listId, locationId }) => {
    await apiAddLocationToList(locationId, listId)
    return { listId, locationId }
  },
)

export const removeLocationFromList = createAsyncThunk(
  'save/removeLocationFromList',
  async ({ listId, locationId }, { getState }) => {
    await apiRemoveLocationFromList(Number(locationId), listId)

    const lists = getState().save.lists
    const locationStillInAnyList = lists.some(
      (list) =>
        list.id !== listId && list.locations.some((l) => l.id === locationId),
    )

    return { listId, locationId, locationStillInAnyList }
  },
)

const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchLists.pending]: (state) => {
      state.isLoading = true
    },
    [fetchLists.fulfilled]: (state, action) => {
      state.isLoading = false
      state.lists = action.payload.map((list) => ({
        ...list,
        locations: list.locations ?? [],
      }))
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
      state.isAddingNew = true
    },
    [addList.fulfilled]: (state, action) => {
      state.isAddingNew = false
      state.lists.push(action.payload)
    },
    [addList.rejected]: (state, action) => {
      state.isAddingNew = false
      toast.error(
        i18next.t('error_message.api.add_location_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [removeList.fulfilled]: (state, action) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload)
    },
    [removeList.rejected]: (state, action) => {
      toast.error(
        i18next.t('error_message.api.remove_location_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [renameList.fulfilled]: (state, action) => {
      const { listId, newName } = action.payload
      const list = state.lists.find((list) => list.id === listId)
      if (list) {
        list.name = newName
      }
    },
    [renameList.rejected]: (state, action) => {
      toast.error(
        i18next.t('error_message.api.rename_location_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [addLocationToList.pending]: (state, action) => {
      const { listId } = action.meta.arg
      state.pendingToggles[listId] = true
    },
    [addLocationToList.fulfilled]: (state, action) => {
      const { listId, locationId } = action.payload
      delete state.pendingToggles[listId]
      const listIndex = state.lists.findIndex((list) => list.id === listId)
      if (listIndex !== -1) {
        state.lists[listIndex].locations.push({ id: locationId })
      }
    },
    [addLocationToList.rejected]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.pendingToggles[listId]
      toast.error(
        i18next.t('error_message.api.add_location_to_list_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [removeLocationFromList.pending]: (state, action) => {
      const { listId } = action.meta.arg
      state.pendingToggles[listId] = false
    },
    [removeLocationFromList.fulfilled]: (state, action) => {
      const { listId, locationId } = action.payload
      delete state.pendingToggles[listId]
      const listIndex = state.lists.findIndex((list) => list.id === listId)
      if (listIndex !== -1) {
        state.lists[listIndex].locations = state.lists[
          listIndex
        ].locations.filter((l) => l.id !== locationId)
      }
    },
    [removeLocationFromList.rejected]: (state, action) => {
      const { listId } = action.meta.arg
      delete state.pendingToggles[listId]
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
