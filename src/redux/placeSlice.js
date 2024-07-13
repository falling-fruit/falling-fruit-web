import { createSlice } from '@reduxjs/toolkit'

export const placeSlice = createSlice({
  name: 'place',
  initialState: {
    selectedPlace: null,
    placeSuggestions: null,
  },
  reducers: {
    selectPlace: (state, action) => {
      state.selectedPlace = action.payload.place
      state.placeSuggestions = action.payload.suggestionsData
    },
    clearSelectedPlace: (state) => {
      state.selectedPlace = null
      state.placeSuggestions = null
    },
  },
})

export const { selectPlace, clearSelectedPlace } = placeSlice.actions

export default placeSlice.reducer
