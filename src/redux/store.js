import { configureStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'

import activityReducer from './activitySlice'
import authReducer from './authSlice'
import filterReducer from './filterSlice'
import geolocationReducer from './geolocationSlice'
import listReducer from './listSlice'
import locationReducer from './locationSlice'
import mapReducer from './mapSlice'
import miscReducer from './miscSlice'
import placeReducer from './placeSlice'
import reviewReducer from './reviewSlice'
import settingsReducer from './settingsSlice'
import typeReducer from './typeSlice'
import viewportReducer from './viewportSlice'

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
    place: placeReducer,
    type: typeReducer,
    viewport: viewportReducer,
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
