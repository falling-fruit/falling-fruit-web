import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import persistentStore from '../utils/persistentStore'
import { selectPlace } from './placeSlice'

const viewportSlice = createSlice({
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
      const view = {
        ...action.payload,
        height: action.payload.height || state.lastMapView?.height,
        width: action.payload.width || state.lastMapView?.width,
      }
      state.lastMapView = view
      try {
        persistentStore.setLastMapViewThrottledSync(view)
      } catch (error) {
        toast.error(error?.message ?? error)
      }
    },
  },
  extraReducers: {
    [selectPlace]: (state, action) => {
      const view = {
        height: state.lastMapView.height,
        width: state.lastMapView.width,
        ...action.payload.place.view,
      }
      state.lastMapView = view
      try {
        persistentStore.setLastMapViewImmediateSync(view)
      } catch (error) {
        toast.error(error?.message ?? error)
      }
    },
  },
})

export const { updateLastMapView } = viewportSlice.actions

export default viewportSlice.reducer
