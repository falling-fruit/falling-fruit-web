import { createSlice } from '@reduxjs/toolkit'

const miscSlice = createSlice({
  name: 'misc',
  initialState: {
    isDesktop: null,
    isEmbed: null,
  },
  reducers: {
    layoutChange: (state, action) => {
      state.isDesktop = action.payload.isDesktop
      state.isEmbed = action.payload.isEmbed
    },
  },
})

export const { layoutChange } = miscSlice.actions

export default miscSlice.reducer
