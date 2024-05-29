import { getGeocode } from 'use-places-autocomplete'

// Use fixed zoom level centered at lat and lng:
// 1 degree lon/lat is around 111 km near the equator
// so an approximate area is ( 2 * RADIUS )^2 * 111 km^2
//
const ZOOM_IN_RADIUS = 0.001
export const getZoomedInView = (centerLat, centerLng) =>
  // around 50 m^2 or quarter acre
  ({
    ne: { lat: centerLat + ZOOM_IN_RADIUS, lng: centerLng + ZOOM_IN_RADIUS },
    sw: { lat: centerLat - ZOOM_IN_RADIUS, lng: centerLng - ZOOM_IN_RADIUS },
  })

const ZOOM_OUT_RADIUS = 0.1
export const getZoomedOutView = (centerLat, centerLng) =>
  // Around 50 km^2
  ({
    ne: { lat: centerLat + ZOOM_OUT_RADIUS, lng: centerLng + ZOOM_OUT_RADIUS },
    sw: { lat: centerLat - ZOOM_OUT_RADIUS, lng: centerLng - ZOOM_OUT_RADIUS },
  })

export const getPlaceBounds = async (placeId) => {
  const results = await getGeocode({ placeId })
  const {
    geometry: { viewport },
  } = results[0]

  const [ne, sw] = [viewport.getNorthEast(), viewport.getSouthWest()]
  return {
    ne: { lat: ne.lat(), lng: ne.lng() },
    sw: { lat: sw.lat(), lng: sw.lng() },
  }
}
