/**
 * Converts a result from the Geocoding API to an object with city, state,
 * country, and country code
 */
const resultToLocationInfo = (result) => {
  const locationInfo = {}

  for (const { types, long_name, short_name } of result.address_components) {
    if (types.includes('sublocality') || types.includes('locality')) {
      locationInfo.city = long_name
    } else if (types.includes('administrative_area_level_1')) {
      locationInfo.state = short_name
    } else if (types.includes('country')) {
      locationInfo.country = long_name
      locationInfo.country_code = short_name
    }
  }

  return locationInfo
}

/**
 * Reverse geocodes latitude and longitude to return an object with city,
 * state, country, and country code
 */
const getLocationInfo = async (lat, lng) => {
  const geocoder = new window.google.maps.Geocoder()
  const { results } = await geocoder.geocode({ location: { lat, lng } })

  if (results[0]) {
    return resultToLocationInfo(results[0])
  } else {
    throw 'No results found'
  }
}

/**
 * Reverse geocodes latitude and longitude to return a string formatted as
 * "<city>, <state>, <country>"
 */
const getFormattedLocationInfo = async (lat, lng) => {
  const { city, state, country } = await getLocationInfo(lat, lng)
  if (state) {
    return `${city}, ${state}, ${country}`
  } else {
    return `${city}, ${country}`
  }
}

/**
 * Reverse geocodes latitude and longitude to returns the street address
 */
const getStreetAddress = async (lat, lng) => {
  const geocoder = new window.google.maps.Geocoder()
  const { results } = await geocoder.geocode({ location: { lat, lng } })
  return results[0].formatted_address
}

/**
 * Returns whether the location has seasonality information
 */
const hasSeasonality = (locationData) =>
  !!(
    locationData.no_season != null ||
    (locationData.season_start != null && locationData.season_stop != null)
  )

export {
  getFormattedLocationInfo,
  getLocationInfo,
  getStreetAddress,
  hasSeasonality,
}
