import { useEffect, useState } from 'react'

const useGeoLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({})

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

  const locSuccess = async (pos) => {
    console.log('success!')
    var lat = pos.coords.latitude
    var lon = pos.coords.longitude

    const latlng = {
      lat: lat,
      lng: lon,
    }

    const cityName = await extractCityName(latlng)
    setCurrentLocation({ name: cityName, coords: latlng })
  }

  const locError = () => {
    console.log('error!')
  }

  const handleLocationError = (browserHasGeolocation) => {
    console.log(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation.",
    )
  }
  useEffect(() => {
    if (navigator.geolocation) {
      console.log('entered')

      navigator.geolocation.getCurrentPosition(locSuccess, locError, {
        timeout: 5000,
      })
    } else {
      console.log('ERR')

      // Browser doesn't support Geolocation
      handleLocationError(false)
    }
  }, [])

  return currentLocation
}

export default useGeoLocation
