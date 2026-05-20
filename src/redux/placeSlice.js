import { createSlice } from '@reduxjs/toolkit'

const placeSlice = createSlice({
  name: 'place',
  initialState: {
    selectedPlace: null,
  },
  reducers: {
    selectPlace: (state, action) => {
      state.selectedPlace = action.payload.place
    },
    clearSelectedPlace: (state) => {
      state.selectedPlace = null
    },
  },
})

export const { selectPlace, clearSelectedPlace } = placeSlice.actions

export default placeSlice.reducer
