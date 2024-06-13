import { getGeocode } from 'use-places-autocomplete'

const BOUND_DELTA = 0.001

export const getZoomedInView = (locationLat, locationLng) =>
  // Use fixed zoom level locationed at lat and long
  ({
    location: {
      lat: locationLat,
      lng: locationLng,
      description: `${locationLat}, ${locationLng}`,
    },
    viewport: {
      ne: { lat: locationLat + BOUND_DELTA, lng: locationLng + BOUND_DELTA },
      sw: { lat: locationLat - BOUND_DELTA, lng: locationLng - BOUND_DELTA },
    },
  })

export const getPlaceBounds = async (placeId) => {
  const results = await getGeocode({ placeId })
  const {
    formatted_address,
    geometry: { viewport, location },
  } = results[0]

  const [ne, sw] = [viewport.getNorthEast(), viewport.getSouthWest()]
  return {
    location: {
      lat: location.lat(),
      lng: location.lng(),
      description: formatted_address,
    },
    viewport: {
      ne: { lat: ne.lat(), lng: ne.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
    },
  }
}
