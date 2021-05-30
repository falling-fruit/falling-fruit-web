import { createSelector } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { fetchFilterCounts } from './filterSlice'
import { fetchListLocations } from './listSlice'
import { fetchMapClusters, fetchMapLocations, viewChange } from './mapSlice'

/**
 * Maximum zoom level at which clusters will be displayed. At zoom levels
 * greater than VISIBLE_CLUSTER_ZOOM_LIMIT, locations will be displayed.
 * @constant {number}
 */
const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

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
    } else {
      dispatch(fetchMapLocations())

      const state = getState()
      if (state.misc.isDesktop && state.list.shouldFetchNewLocations) {
        dispatch(fetchListLocations({ fetchCount: true, offset: 0 }))
      }
    }
  }
}

export const viewChangeAndFetch = (view) => (dispatch, getState) => {
  const state = getState()

  dispatch(viewChange(view))
  dispatch(fetchLocations())

  if (state.filter.isOpen) {
    dispatch(fetchFilterCounts())
  }
}
