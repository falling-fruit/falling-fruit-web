import { createSlice } from '@reduxjs/toolkit'

export const shareSlice = createSlice({
  name: 'share',
  initialState: {
    isOpenInMobileLayout: false,
  },
  reducers: {
    openShare: (state) => {
      state.isOpenInMobileLayout = true
    },
    closeShare: (state) => {
      state.isOpenInMobileLayout = false
    },
  },
})

export const { openShare, closeShare } = shareSlice.actions

export default shareSlice.reducer
