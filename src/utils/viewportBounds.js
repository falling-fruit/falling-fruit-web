import { getGeocode } from 'use-places-autocomplete'

export const getZoomedInView = (centerLat, centerLng) =>
  // Use fixed zoom level centered at lat and long
  ({
    center: { lat: centerLat, lng: centerLng },
    zoom: 18,
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
