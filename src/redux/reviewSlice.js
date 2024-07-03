import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

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
    reviewId: null,
    isLoading: false,
    review: null,
  },
  extraReducers: {
    [fetchReviewData.pending]: (state) => {
      state.isLoading = true
    },
    [fetchReviewData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.review = action.payload
    },
    [fetchReviewData.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(`Error fetching review data: ${action.payload}`)
    },
  },
})

export default reviewSlice.reducer
