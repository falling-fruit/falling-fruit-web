import { createSelector } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { fetchFilterCounts } from './filterSlice'
import { clearListLocations } from './listSlice'
import {
  fetchMapClusters,
  fetchMapLocations,
  stopTrackingLocation,
  viewChange,
} from './mapSlice'

/**
 * Maximum zoom level at which clusters will be displayed. At zoom levels
 * greater than VISIBLE_CLUSTER_ZOOM_LIMIT, locations will be displayed.
 * @constant {number}
 */
export const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

export const getIsShowingClusters = (state) =>
  state.map.view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT

export const getAllLocations = createSelector(
  (state) => state.map.locations,
  (state) => state.list.locations,
  (state) => state.misc.isDesktop,
  (mapLocations, listLocations, isDesktop) =>
    isDesktop
      ? unionWith(eqBy(prop('id')), mapLocations, listLocations)
      : mapLocations,
)

export const fetchLocations = () => (dispatch, getState) => {
  const state = getState()
  const { zoom, bounds } = state.map.view

  if (bounds?.ne.lat != null && zoom > 1) {
    // Map has received real bounds
    if (getIsShowingClusters(state)) {
      dispatch(fetchMapClusters())
      dispatch(clearListLocations())
    } else {
      dispatch(fetchMapLocations())
    }
  }
}

const shouldStopTrackingLocation = (geolocation, newView, threshold) => {
  // Allows the user a certain amount of leeway to adjust the zoom without disabling tracking current location

  if (!geolocation || geolocation.loading) {
    return false
  }

  const { lat, lng } = newView.center
  const { latitude, longitude } = geolocation

  const dist = Math.pow(lat - latitude, 2) + Math.pow(longitude - lng, 2)
  // We need to take into account new zoom to convert true distance to how much the user moved the center on the screen
  // TODO: fine-tune this formula
  const screenDist = dist * Math.pow(Math.pow(2, newView.zoom), 2)

  // Uncomment if fine-tuning screenDist formula
  /*
  console.log(
    'shouldStopTrackingLocation. zoom:',
    newView.zoom,
    'screenDist:',
    screenDist,
    'threshold:',
    STOP_TRACKING_LOCATION_DIST,
  )
  */
  return screenDist >= threshold
}

export const viewChangeAndFetch = (newView) => (dispatch, getState) => {
  const state = getState()
  // TODO: fine-tune this constant
  const stopTrackingLocationThreshold = state.misc.isDesktop ? 5000 : 2000

  if (
    shouldStopTrackingLocation(
      state.map.geolocation,
      newView,
      stopTrackingLocationThreshold,
    )
  ) {
    dispatch(stopTrackingLocation())
  }

  dispatch(viewChange(newView))
  dispatch(fetchLocations())

  if (state.filter.isOpen || state.misc.isDesktop) {
    dispatch(fetchFilterCounts())
  }
}
