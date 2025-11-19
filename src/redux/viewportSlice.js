import { createSlice } from '@reduxjs/toolkit'

import persistentStore from '../utils/persistentStore'
import { selectPlace } from './placeSlice'

export const viewportSlice = createSlice({
  name: 'viewport',
  initialState: {
    lastMapView: persistentStore.getLastMapView(),
  },
  reducers: {
    updateLastMapView: (state, action) => {
      /*
       * height and width are set to zero when coming back from list or activity page
       * (if the API was previously loaded but map went off screen)
       */
      // Hold on to the viewport dimensions so we can use it
      state.lastMapView = {
        ...action.payload,
        height: action.payload.height || state.lastMapView?.height,
        width: action.payload.width || state.lastMapView?.width,
      }
      persistentStore.setLastMapViewThrottledSync(state.lastMapView)
    },
  },
  extraReducers: {
    [selectPlace]: (state, action) => {
      state.lastMapView = {
        height: state.lastMapView.height,
        width: state.lastMapView.width,
        ...action.payload.place.view,
      }
      persistentStore.setLastMapViewImmediateSync(state.lastMapView)
    },
  },
})

export const { updateLastMapView } = viewportSlice.actions

export default viewportSlice.reducer
