import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
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
    [fetchReviewData.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(
        i18next.t('error_message.api.fetch_review_failed', {
          id: action.meta.arg,
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
  },
})

export const { clearReview, saveReviewFormValues, setReviewData } =
  reviewSlice.actions

export default reviewSlice.reducer
