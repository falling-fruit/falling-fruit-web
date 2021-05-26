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

export const viewChange = (view) => (dispatch) => {
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
      dispatch(fetchListLocations())

      /* selector
      const locationsWithTypeNames = locations.map((location) => ({
        ...location,
        typeName: getTypeName(location.type_ids[0]),
      }))
      */
    }
  }
}
