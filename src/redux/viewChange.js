import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../constants/map'
import { fetchFilterCounts } from './filterSlice'
import { disableGeolocation } from './geolocationSlice'
import { invalidateListLocations } from './listSlice'
import { fetchMapClusters, fetchMapLocations } from './mapSlice'

export const getIsShowingClusters = (state) => {
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
      state.geolocation.geolocation,
      newView,
      stopTrackingLocationThreshold,
    )
  ) {
    dispatch(disableGeolocation())
  }

  dispatch(invalidateListLocations())

  dispatch(fetchLocations())

  if (state.filter.isOpen || state.misc.isDesktop) {
    dispatch(fetchFilterCounts())
  }
}
