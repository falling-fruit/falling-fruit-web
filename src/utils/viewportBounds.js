import { getGeocode } from 'use-places-autocomplete'

const BOUND_DELTA = 0.001

export const getZoomedInView = (centerLat, centerLng) =>
  // Use fixed zoom level centered at lat and long
  ({
    ne: { lat: centerLat + BOUND_DELTA, lng: centerLng + BOUND_DELTA },
    sw: { lat: centerLat - BOUND_DELTA, lng: centerLng - BOUND_DELTA },
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
