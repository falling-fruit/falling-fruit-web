import { getGeocode } from 'use-places-autocomplete'

const CURRENT_LOCATION_VIEWPORT_RADIUS = 0.001

export const getGeolocationBounds = (latitude, longitude) =>
  // Use fixed viewport around the lat and long of the current location

  ({
    ne: {
      lat: latitude + CURRENT_LOCATION_VIEWPORT_RADIUS,
      lng: longitude + CURRENT_LOCATION_VIEWPORT_RADIUS,
    },
    sw: {
      lat: latitude - CURRENT_LOCATION_VIEWPORT_RADIUS,
      lng: longitude - CURRENT_LOCATION_VIEWPORT_RADIUS,
    },
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
