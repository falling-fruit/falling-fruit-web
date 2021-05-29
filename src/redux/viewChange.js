import { createSelector } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { fetchFilterCounts } from './filterSlice'
import { fetchListLocations } from './listSlice'
import { fetchMapClusters, fetchMapLocations, viewChange } from './mapSlice'

const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

export const allLocationsSelector = createSelector(
  (state) => state.map.locations,
  (state) => state.list.locations,
  (state) => state.misc.isDesktop,
  (mapLocations, listLocations, isDesktop) =>
    isDesktop
      ? unionWith(eqBy(prop('id')), mapLocations, listLocations)
      : mapLocations,
)

export const fetchLocations = () => (dispatch, getState) => {
  const { zoom, bounds } = getState().map.view

  if (bounds?.ne.lat != null && zoom > 1) {
    // Map has received real bounds
    if (zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT) {
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
