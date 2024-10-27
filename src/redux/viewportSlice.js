import { createSlice } from '@reduxjs/toolkit'

import { selectPlace } from './placeSlice'

export const viewportSlice = createSlice({
  name: 'viewport',
  initialState: {
    lastMapView: null,
  },
  reducers: {
    updateLastMapView: (state, action) => {
      if (action.payload.width > 0 && action.payload.height > 0) {
        state.lastMapView = action.payload
      }
    },
  },
  extraReducers: {
    [selectPlace]: (state, action) => {
      state.lastMapView = {
        height: state.lastMapView.height,
        width: state.lastMapView.width,
        ...action.payload.place.view,
      }
    },
  },
})

export const { updateLastMapView } = viewportSlice.actions

export default viewportSlice.reducer
