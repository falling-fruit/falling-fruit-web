import { getGeocode } from 'use-places-autocomplete'

export const getZoomedInView = (centerLat, centerLng) =>
  // Use fixed zoom level centered at lat and long
  ({
    ne: { lat: centerLat + 0.1, lng: centerLng + 0.1 },
    sw: { lat: centerLat - 0.1, lng: centerLng - 0.1 },
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
