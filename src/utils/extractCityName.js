const extractCityName = (latlng) => {
  const geocoder = new window.google.maps.Geocoder()

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          resolve(
            results[0].plus_code.compound_code.split(' ').slice(1).join(' '),
          )
        } else {
          reject('No results found')
        }
      } else {
        reject(`Geocoder failed due to: ${status}`)
      }
    })
  })
}
export default extractCityName
