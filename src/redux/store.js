import { configureStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'

import authReducer from './authSlice'
import filterReducer from './filterSlice'
import geolocationReducer from './geolocationSlice'
import listReducer from './listSlice'
import locationReducer from './locationSlice'
import mapReducer from './mapSlice'
import miscReducer, { fetchAllTypes } from './miscSlice'
import reviewReducer from './reviewSlice'
import settingsReducer from './settingsSlice'

export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    map: mapReducer,
    list: listReducer,
    filter: filterReducer,
    settings: settingsReducer,
    auth: authReducer,
    misc: miscReducer,
    location: locationReducer,
    review: reviewReducer,
    geolocation: geolocationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

store.dispatch(fetchAllTypes())
