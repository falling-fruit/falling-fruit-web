import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../constants/map'
import { fetchFilterCounts } from './filterSlice'
import { fetchMapClusters, fetchMapLocations } from './mapSlice'
import { updateSelection } from './updateSelection'

const getIsShowingClusters = (state) => {
  const map = state.map.googleMap
  if (map) {
    return map.getZoom() <= VISIBLE_CLUSTER_ZOOM_LIMIT
  } else {
    return false
  }
}

export const fetchLocations = () => (dispatch, getState) => {
  const state = getState()
  if (getIsShowingClusters(state)) {
    dispatch(fetchMapClusters())
  } else {
    dispatch(fetchMapLocations())
  }
}

export const invasiveChanged = (checked) => (dispatch) => {
  dispatch(updateSelection({ invasive: checked }))
  dispatch(fetchFilterCounts())
  dispatch(fetchLocations())
}

export const muniChanged = (checked) => (dispatch) => {
  dispatch(updateSelection({ muni: checked }))
  dispatch(fetchFilterCounts())
  dispatch(fetchLocations())
}

export const selectionChanged = (types) => (dispatch) => {
  dispatch(updateSelection({ types }))
  dispatch(fetchLocations())
}
