export const parseUrl = () => {
  const url = window.location.href
  const geocoordmatch = url.substring(url.indexOf('@'))
  console.log('match', geocoordmatch)

  const getCoords = isValidCoord(geocoordmatch)

  if (getCoords.valid) {
    return {
      center: { lat: getCoords.lat, lng: getCoords.lng },
      zoom: getCoords.zoom,
    }
  } else {
    return { center: { lat: 40.1125785, lng: -88.2287926 }, zoom: 1 }
  }
}

const isValidCoord = (geocoordmatch) => {
  const floatRegex = /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/
  console.log(geocoordmatch)
  if (!geocoordmatch) {
    return false
  }
  const param = geocoordmatch
  //@lat,long,zoomz

  const values = param.substring(1, param.length - 1).split(',')
  return {
    valid:
      (param.match(/\,/g) || []).length === 2 &&
      param.charAt(0) === '@' &&
      param.charAt(param.length - 1) === 'z' &&
      floatRegex.test(values[0]) &&
      floatRegex.test(values[1]) &&
      floatRegex.test(values[2]) &&
      parseFloat(values[0]) >= -90 &&
      parseFloat(values[0]) <= 90 &&
      parseFloat(values[1]) >= -180 &&
      parseFloat(values[1]) <= 180 &&
      parseFloat(values[2]) > 1 &&
      parseFloat(values[2]) <= 21,
    lat: parseFloat(values[0]),
    lng: parseFloat(values[1]),
    zoom: parseFloat(values[2]),
  }
}
