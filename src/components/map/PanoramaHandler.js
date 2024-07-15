import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const DEFAULT_LOCATION = { lat: 40.729884, lng: -73.990988 }

const PanoramaHandler = () => {
  const locationMarkerRef = useRef(null)
  const panoramaRef = useRef(null)

  const {
    streetView: showStreetView,
    googleMap,
    getGoogleMaps,
  } = useSelector((state) => state.map)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null
  const mapLocation = useSelector((state) => state.location.location)

  useEffect(() => {
    if (!googleMap || !googleMaps) {
      return
    }

    const initializePanorama = () => {
      panoramaRef.current = googleMap.getStreetView()
      panoramaRef.current.setOptions({
        disableDefaultUI: true,
        enableCloseButton: false,
      })
    }

    const updatePanorama = async () => {
      if (!panoramaRef.current) {
        initializePanorama()
      }

      const panorama = panoramaRef.current
      const location = mapLocation || DEFAULT_LOCATION

      try {
        const panoClient = new googleMaps.StreetViewService()
        const panoData = await panoClient.getPanorama({
          location: location,
          radius: 50,
        })

        const panoLocation = panoData.data.location.latLng
        const heading = googleMaps.geometry.spherical.computeHeading(
          panoLocation,
          location,
        )

        panorama.setPosition(panoLocation)
        panorama.setPov({ heading, pitch: 0 })
        panorama.setVisible(showStreetView)

        updateMarker(panorama, location)
      } catch (error) {
        console.error('Street View data not found for this location.', error)
        panorama.setVisible(false)
        if (locationMarkerRef.current) {
          locationMarkerRef.current.setMap(null)
        }
      }
    }

    const updateMarker = (panorama, location) => {
      if (showStreetView) {
        if (!locationMarkerRef.current) {
          locationMarkerRef.current = new googleMaps.Marker({
            position: location,
          })
        } else {
          locationMarkerRef.current.setPosition(location)
        }
        locationMarkerRef.current.setMap(panorama)
      } else if (locationMarkerRef.current) {
        locationMarkerRef.current.setMap(null)
      }
    }

    updatePanorama()

    return () => {
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setMap(null)
      }
    }
  }, [mapLocation, showStreetView, googleMap, googleMaps])

  return null
}

export default PanoramaHandler
