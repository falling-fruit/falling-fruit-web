import { createSlice } from '@reduxjs/toolkit'

const placesSlice = createSlice({
  name: 'places',
  initialState: {
    selectedPlace: null,
  },
  reducers: {
    clearSelectedPlace: (state) => {
      console.log('clearSelectedPlace', state)
      state.selectedPlace = null
    },
    selectPlace: (state, action) => {
      console.log('selectPlace', state, action)
      state.selectedPlace = action.payload
    },
  },
})

export const { selectPlace, clearSelectedPlace } = placesSlice.actions

export default placesSlice.reducer
