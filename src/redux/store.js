import { configureStore } from '@reduxjs/toolkit'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

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
    misc: miscReducer,
    router: connectRouter(history),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      routerMiddleware(history),
    ),
})

store.dispatch(fetchAllTypes())
