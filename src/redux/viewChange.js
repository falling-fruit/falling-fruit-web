import { createSelector } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { fetchFilterCounts } from './filterSlice'
import { clearListLocations, fetchListLocations } from './listSlice'
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

const STOP_TRACKING_LOCATION_DIST = 2000

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

      const state = getState()
      if (state.misc.isDesktop && state.list.shouldFetchNewLocations) {
        dispatch(fetchListLocations({ fetchCount: true, offset: 0 }))
      }
    }
  }
}

const shouldStopTrackingLocation = (geolocation, newView) => {
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

  console.log(
    'shouldStopTrackingLocation',
    newView.zoom,
    screenDist,
    STOP_TRACKING_LOCATION_DIST,
  )
  return screenDist >= STOP_TRACKING_LOCATION_DIST
}

export const viewChangeAndFetch = (newView) => (dispatch, getState) => {
  const state = getState()

  if (shouldStopTrackingLocation(state.map.geolocation, newView)) {
    dispatch(stopTrackingLocation())
  }

  dispatch(viewChange(newView))
  dispatch(fetchLocations())

  if (state.filter.isOpen) {
    dispatch(fetchFilterCounts())
  }
}
