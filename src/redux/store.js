import { configureStore } from '@reduxjs/toolkit'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import settingsReducer from './settingsSlice'

export const history = createBrowserHistory()

export default configureStore({
  reducer: { settings: settingsReducer, router: connectRouter(history) },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(routerMiddleware(history)),
})
