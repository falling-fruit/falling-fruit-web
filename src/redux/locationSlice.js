import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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

export const submitLocation = createAsyncThunk(
  'location/submitLocation',
  async ({ editingId, locationValues }) => {
    let response
    try {
      if (editingId) {
        response = await editLocation(editingId, locationValues)
        toast.success('Location edited successfully!')
      } else {
        response = await addLocation(locationValues)
        toast.success('Location submitted successfully!')
      }
      return response
    } catch (error) {
      toast.error(
        editingId ? 'Location editing failed.' : 'Location submission failed.',
      )
      throw error
    }
  },
)

export const submitLocationReview = createAsyncThunk(
  'location/submitLocationReview',
  async ({ locationId, reviewValues, editingId }) => {
    let response
    try {
      if (editingId) {
        response = await editReview(editingId, reviewValues)
        toast.success('Review edited successfully!')
      } else {
        response = await addReview(locationId, reviewValues)
        toast.success('Review submitted successfully!')
      }
      return response
    } catch (error) {
      toast.error(
        editingId ? 'Review editing failed.' : 'Review submission failed.',
      )
      throw error
    }
  },
)

export const deleteLocationReview = createAsyncThunk(
  'location/deleteReview',
  async (reviewId) => {
    try {
      await deleteReview(reviewId)
      toast.success('Review deleted successfully!')
      return reviewId
    } catch (error) {
      toast.error('Review deletion failed.')
      throw error
    }
  },
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
    },
    initNewLocation: (state, action) => {
      state.isLoading = false
      state.location = null
      state.isBeingEdited = false
      if (state.locationId !== 'new') {
        state.locationId = 'new'
        state.position = action.payload
        state.tooltipOpen = true
      }
      state.form = null
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
      state.pane.drawerFullyOpen = false
      console.log('fetchLocationData.pending')
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
        `Error fetching location ${action.meta.arg.locationId}: ${action.error.message}`,
      )
    },
    [fetchReviewData.fulfilled]: (state, action) => {
      state.isLoading = false
      state.location = null
      state.locationId = parseInt(action.payload.location_id)
      state.position = null
      state.isBeingEdited = false
    },
    [submitLocation.fulfilled]: (state, action) => {
      if (action.meta.arg.editingId) {
        /*
         * submitLocation does not return the reviews for efficiency
         * but they don't change when editing location
         * so keep the known reviews
         */
        state.location = action.payload
      } else {
        /*
         * New location added
         */
        state.location = action.payload
        state.reviews = []
        state.locationId = parseInt(action.payload.id)
      }
      state.isLoading = false
      state.isBeingEdited = false
      state.position = { lat: action.payload.lat, lng: action.payload.lng }
    },
    [submitLocationReview.fulfilled]: (state, action) => {
      if (action.meta.arg.editingId) {
        const reviewIndex = state.reviews.findIndex(
          (review) => review.id === action.meta.arg.editingId,
        )
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex] = action.payload
        }
      } else {
        state.reviews.push(action.payload)
      }
    },
    [deleteLocationReview.fulfilled]: (state, action) => {
      state.reviews = state.reviews.filter(
        (review) => review.id !== action.payload,
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
} = locationSlice.actions

export default locationSlice.reducer
