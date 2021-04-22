import { getGeocode } from 'use-places-autocomplete'

export const getProperViewState = (latitude, longitude) =>
  // Use fixed viewport around the lat and long of the current location
  ({
    center: { lat: latitude, lng: longitude },
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
