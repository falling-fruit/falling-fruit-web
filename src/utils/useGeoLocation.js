import { useEffect, useState } from 'react'

const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState()
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locSuccess, locError, {
        timeout: 5000,
      })
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false)
    }
  }, [])

  const locSuccess = async (pos) => {
    var lat = pos.coords.latitude
    var lng = pos.coords.longitude

    const latlng = {
      lat: lat,
      lng: lng,
    }

    const cityName = await extractCityName(latlng)
    setCurrentLocation({ name: cityName, coords: latlng })
  }

  const locError = () => {
    // User did provide us access to their location
    console.log('Unable to get current position')
  }

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

  const handleLocationError = (browserHasGeolocation) => {
    console.log(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation.",
    )
  }

  return currentLocation
}

export default useGeolocation
