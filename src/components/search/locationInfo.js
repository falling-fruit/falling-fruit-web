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

const getLocationInfo = async (lat, lng) => {
  const geocoder = new window.google.maps.Geocoder()
  const { results } = await geocoder.geocode({ location: { lat, lng } })

  if (results[0]) {
    return resultToLocationInfo(results[0])
  } else {
    throw 'No results found'
  }
}

const getFormattedLocationInfo = async (lat, lng) => {
  const { city, state, country } = await getLocationInfo(lat, lng)
  if (state) {
    return `${city}, ${state}, ${country}`
  } else {
    return `${city}, ${country}`
  }
}

export { getFormattedLocationInfo, getLocationInfo }
