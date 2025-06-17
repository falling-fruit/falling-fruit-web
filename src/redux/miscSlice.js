import { createSlice } from '@reduxjs/toolkit'

export const miscSlice = createSlice({
  name: 'misc',
  initialState: {
    isDesktop: null,
    isEmbed: null,
    locationsWithoutPanorama: {},
  },
  reducers: {
    layoutChange: (state, action) => {
      state.isDesktop = action.payload.isDesktop
      state.isEmbed = action.payload.isEmbed
    },
    addLocationWithoutPanorama: (state, action) => {
      state.locationsWithoutPanorama[action.payload] = true
    },
  },
})

export const { addLocationWithoutPanorama, layoutChange } = miscSlice.actions

export default miscSlice.reducer
