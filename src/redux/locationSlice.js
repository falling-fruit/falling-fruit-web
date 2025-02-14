import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'
import { toast } from 'react-toastify'

import {
  addLocation,
  addReview,
  deleteReview,
  editLocation,
  editReview,
  getLocationById,
} from '../utils/api'
import { fetchReviewData } from './reviewSlice'

export const fetchLocationData = createAsyncThunk(
  'location/fetchLocationData',
  async ({
    locationId,
    isBeingEdited: _,
    isStreetView: __,
    paneDrawerDisabled: ___,
  }) => {
    const locationData = await getLocationById(locationId, 'reviews')
    return locationData
  },
)
export const addNewLocation = createAsyncThunk(
  'location/addNewLocation',
  addLocation,
)

export const editExistingLocation = createAsyncThunk(
  'location/editExistingLocation',
  ({ locationId, locationValues }) => editLocation(locationId, locationValues),
)

export const addNewReview = createAsyncThunk(
  'location/addNewReview',
  ({ locationId, reviewValues }) => addReview(locationId, reviewValues),
)

export const editExistingReview = createAsyncThunk(
  'location/editExistingReview',
  ({ reviewId, reviewValues }) => editReview(reviewId, reviewValues),
)

export const deleteLocationReview = createAsyncThunk(
  'location/deleteReview',
  (reviewId) => deleteReview(reviewId).then(() => reviewId),
)

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    isLoading: false,
    location: null,
    reviews: [],
    position: null, // {lat: number, lng: number}
    locationId: null,
    isBeingEdited: false,
    fromSettings: false,
    form: null,
    tooltipOpen: false,
    streetViewOpen: false,
    lightbox: {
      isOpen: false,
      reviewIndex: null,
      photoIndex: null,
    },
    pane: {
      drawerFullyOpen: false,
      drawerDisabled: false,
      tabIndex: 0,
    },
    isBeingInitializedMobile: false,
  },
  reducers: {
    clearLocation: (state) => {
      state.isLoading = false
      state.location = null
      state.locationId = null
      state.position = null
      state.isBeingEdited = false
      state.form = null
      state.tooltipOpen = false
      state.streetViewOpen = false
      state.lightbox.isOpen = false
      state.lightbox.reviewIndex = null
      state.lightbox.photoIndex = null
      state.pane.drawerFullyOpen = false
      state.pane.drawerDisabled = false
      state.pane.tabIndex = 0
      state.isBeingInitializedMobile = false
    },
    initNewLocation: (state, action) => {
      state.isLoading = false
      state.location = null
      state.isBeingEdited = false
      state.locationId = 'new'
      state.tooltipOpen = true
      state.form = null
      state.position = action.payload
      state.streetViewOpen = false
    },
    updatePosition: (state, action) => {
      state.position = action.payload
    },
    saveFormValues: (state, action) => {
      state.form = action.payload
    },
    setIsBeingEditedAndResetPosition: (state, action) => {
      state.isBeingEdited = action.payload
      if (state.location) {
        state.position = { lat: state.location.lat, lng: state.location.lng }
      }
      state.tooltipOpen = action.payload ? true : false
    },
    dismissLocationTooltip: (state) => {
      state.tooltipOpen = false
    },
    reopenLocationTooltip: (state) => {
      state.tooltipOpen = true
    },
    setStreetView: (state, action) => {
      state.streetViewOpen = action.payload
    },
    openLightbox: (state, action) => {
      state.lightbox.isOpen = true
      state.lightbox.reviewIndex = action.payload.reviewIndex
      state.lightbox.photoIndex = action.payload.photoIndex
    },
    closeLightbox: (state) => {
      state.lightbox.isOpen = false
      state.lightbox.reviewIndex = null
      state.lightbox.photoIndex = null
    },
    setLightboxIndices: (state, action) => {
      state.lightbox.reviewIndex = action.payload.reviewIndex
      state.lightbox.photoIndex = action.payload.photoIndex
    },
    reenableAndPartiallyClosePaneDrawer: (state) => {
      state.pane.drawerDisabled = false
      state.pane.drawerFullyOpen = false
    },
    fullyOpenPaneDrawer: (state) => {
      state.pane.drawerFullyOpen = true
    },
    partiallyClosePaneDrawer: (state) => {
      state.pane.drawerFullyOpen = false
    },
    setTabIndex: (state, action) => {
      state.pane.tabIndex = action.payload
    },
    setFromSettings: (state, action) => {
      state.fromSettings = action.payload
    },
    setIsBeingInitializedMobile: (state, action) => {
      state.isBeingInitializedMobile = action.payload
    },
  },
  extraReducers: {
    [fetchLocationData.pending]: (state, action) => {
      state.location = null
      state.locationId = parseInt(action.meta.arg.locationId)
      state.isLoading = true
      state.position = null
      state.isBeingEdited = action.meta.arg.isBeingEdited
      state.form = null
      state.tooltipOpen = action.meta.arg.isBeingEdited
      state.streetViewOpen = action.meta.arg.isStreetView
      state.pane.drawerDisabled = action.meta.arg.paneDrawerDisabled
      state.pane.drawerFullyOpen = action.meta.arg.paneDrawerDisabled
      state.pane.tabIndex = 0
    },
    [fetchLocationData.fulfilled]: (state, action) => {
      state.isLoading = false
      // Accept the fetch if it's the most recent 'pending' one
      if (state.locationId === parseInt(action.payload.id)) {
        const { reviews, ...locationData } = action.payload
        state.location = locationData
        state.reviews = reviews
        state.position = { lat: action.payload.lat, lng: action.payload.lng }
      }
    },
    [fetchLocationData.rejected]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = null
      state.position = null
      state.isBeingEdited = false
      state.tooltipOpen = false
      toast.error(
        i18next.t('error_message.api.fetch_location_failed', {
          id: action.meta.arg.locationId,
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [fetchReviewData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = parseInt(action.payload.location_id)
      state.position = null
      state.isBeingEdited = false
    },
    [addNewLocation.fulfilled]: (state, action) => {
      state.location = action.payload
      state.reviews = action.payload.reviews || []
      state.locationId = parseInt(action.payload.id)
      state.isLoading = false
      state.isBeingEdited = false
      state.isBeingInitializedMobile = false
      state.position = { lat: action.payload.lat, lng: action.payload.lng }
      toast.success('Location submitted successfully!')
    },
    [addNewLocation.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(
        i18next.t('error_message.api.location_submission_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [editExistingLocation.fulfilled]: (state, action) => {
      // Keep existing reviews as they don't change when editing location
      state.location = action.payload
      state.isLoading = false
      state.isBeingEdited = false
      state.position = { lat: action.payload.lat, lng: action.payload.lng }
      toast.success('Location edited successfully!')
    },
    [editExistingLocation.rejected]: (state, action) => {
      state.isLoading = false
      toast.error(
        i18next.t('error_message.api.location_edit_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [addNewReview.fulfilled]: (state, action) => {
      state.reviews.push(action.payload)
      toast.success('Review submitted successfully!')
    },
    [addNewReview.rejected]: (_, action) => {
      toast.error(
        i18next.t('error_message.api.review_submission_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [editExistingReview.fulfilled]: (state, action) => {
      const reviewIndex = state.reviews.findIndex(
        (review) => review.id === action.meta.arg.reviewId,
      )
      if (reviewIndex !== -1) {
        state.reviews[reviewIndex] = action.payload
      }
      toast.success('Review edited successfully!')
    },
    [editExistingReview.rejected]: (_, action) => {
      toast.error(
        i18next.t('error_message.api.review_edit_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
    [deleteLocationReview.fulfilled]: (state, action) => {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload,
      )
      toast.success('Review deleted successfully!')
    },
    [deleteLocationReview.rejected]: (_, action) => {
      toast.error(
        i18next.t('error_message.api.review_deletion_failed', {
          message:
            action.error.message || i18next.t('error_message.unknown_error'),
        }),
      )
    },
  },
})

export const {
  initNewLocation,
  clearLocation,
  updatePosition,
  saveFormValues,
  setIsBeingEditedAndResetPosition,
  dismissLocationTooltip,
  reopenLocationTooltip,
  setStreetView,
  openLightbox,
  closeLightbox,
  setLightboxIndices,
  reenableAndPartiallyClosePaneDrawer,
  setTabIndex,
  fullyOpenPaneDrawer,
  partiallyClosePaneDrawer,
  setFromSettings,
  setIsBeingInitializedMobile,
} = locationSlice.actions

export default locationSlice.reducer
