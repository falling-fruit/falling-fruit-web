import { configureStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'

import credentialReducer from './authSlice'
import filterReducer from './filterSlice'
import listReducer from './listSlice'
import mapReducer from './mapSlice'
import miscReducer, { fetchAllTypes } from './miscSlice'
import settingsReducer from './settingsSlice'

export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    map: mapReducer,
    list: listReducer,
    filter: filterReducer,
    settings: settingsReducer,
    credential: credentialReducer,
    misc: miscReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

store.dispatch(fetchAllTypes())
