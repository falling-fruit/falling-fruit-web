const DEFAULT_LAT = 40.1125785
const DEFAULT_LNG = -88.2287926
const DEFAULT_ZOOM = 1

export const parseUrl = () => {
  const url = window.location.href
  const geocoordMatch = url.substring(url.indexOf('@'))

  const getCoords = isValidCoord(geocoordMatch)

  if (getCoords.valid) {
    return {
      center: { lat: getCoords.lat, lng: getCoords.lng },
      zoom: getCoords.zoom,
    }
  } else {
    return {
      center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
      zoom: DEFAULT_ZOOM,
    }
  }
}

const isValidCoord = (geocoordMatch) => {
  const isFloatRegex = /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/
  if (!geocoordMatch) {
    return false
  }
  const urlParamString = geocoordMatch
  //@lat,long,zoomz

  const parsedUrlValues = urlParamString
    .substring(1, urlParamString.length - 1)
    .split(',')
  return {
    valid:
      (urlParamString.match(/\,/g) || []).length === 2 &&
      urlParamString.charAt(0) === '@' &&
      urlParamString.charAt(urlParamString.length - 1) === 'z' &&
      isFloatRegex.test(parsedUrlValues[0]) &&
      isFloatRegex.test(parsedUrlValues[1]) &&
      isFloatRegex.test(parsedUrlValues[2]) &&
      parseFloat(parsedUrlValues[0]) >= -90 &&
      parseFloat(parsedUrlValues[0]) <= 90 &&
      parseFloat(parsedUrlValues[1]) >= -180 &&
      parseFloat(parsedUrlValues[1]) <= 180 &&
      parseFloat(parsedUrlValues[2]) > 1 &&
      parseFloat(parsedUrlValues[2]) <= 21,
    lat: parseFloat(parsedUrlValues[0]),
    lng: parseFloat(parsedUrlValues[1]),
    zoom: parseFloat(parsedUrlValues[2]),
  }
}
