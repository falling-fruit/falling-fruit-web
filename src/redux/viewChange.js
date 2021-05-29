import { createSelector } from '@reduxjs/toolkit'
import { eqBy, prop, unionWith } from 'ramda'

import { fetchListLocations } from './listSlice'
import { fetchMapClusters, fetchMapLocations, setView } from './mapSlice'

const VISIBLE_CLUSTER_ZOOM_LIMIT = 12

export const allLocationsSelector = createSelector(
  (state) => state.map.locations,
  (state) => state.list.locations,
  (mapLocations, listLocations) =>
    unionWith(eqBy(prop('id')), mapLocations, listLocations),
)

export const viewChange = (view) => (dispatch, getState) => {
  dispatch(setView(view))

  /* router
  if (isAddingLocation) {
    return
  }
  */

  console.log('viewchange', view)

  const { zoom, bounds } = view

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

      // If on desktop, map moves, and updateOnMapMove, reset offset to 0 and fetch list locations: offset 0, limit 30
      // If on desktop, search viewport changes, ^^^
      // If on desktop, updateOnMapMove is unchecked, custom error state

      // If route is not /settings and is on desktop, refresh results

      // Zoom in to see locations

      /* selector
      const locationsWithTypeNames = locations.map((location) => ({
        ...location,
        typeName: getTypeName(location.type_ids[0]),
      }))
      */
    }
  }
}
