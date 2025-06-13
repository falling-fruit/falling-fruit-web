import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getReviewById } from '../utils/api'

export const fetchReviewData = createAsyncThunk(
  'reviews/fetchReviewData',
  async (reviewId) => {
    const reviewData = await getReviewById(reviewId)
    return reviewData
  },
)

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    isLoading: false,
    review: null,
    form: null,
  },
  reducers: {
    clearReview: (state) => {
      state.isLoading = false
      state.review = null
      state.form = null
    },
    saveReviewFormValues: (state, action) => {
      state.form = action.payload
    },
    setReviewData: (state, action) => {
      state.review = action.payload
      state.isLoading = false
    },
  },
  extraReducers: {
    [fetchReviewData.pending]: (state) => {
      state.isLoading = true
    },
    [fetchReviewData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.review = action.payload
    },
    [fetchReviewData.rejected]: (state) => {
      state.isLoading = false
    },
  },
})

export const { clearReview, saveReviewFormValues, setReviewData } =
  reviewSlice.actions

export default reviewSlice.reducer
