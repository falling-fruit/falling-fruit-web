import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const placeholderPlace = { lat: 40.729884, lng: -73.990988 }

const PanoramaHandler = ({ mapRef, mapsRef, showStreetView }) => {
  const [headingStatus, setHeadingStatus] = useState(false)
  const locationMarkerRef = useRef(null)
  const mapLocation = useSelector((state) => state.location.location)
  const dispatch = useDispatch()

  const setHeading = async (panoClient, markerLocation, panorama) => {
    try {
      const pano = await panoClient.getPanorama({
        location: markerLocation,
        radius: 50,
      })

      const heading = mapsRef.current.geometry.spherical.computeHeading(
        pano.data.location.latLng,
        markerLocation,
      )

      panorama.setPov({
        heading: heading,
        pitch: 0,
      })
    } catch (error) {
      return false
    }

    return true
  }

  useEffect(() => {
    const setHeadingWrapper = async () => {
      if (mapRef.current) {
        const panorama = mapRef.current.getStreetView()
        const panoClient = new mapsRef.current.StreetViewService()
        if (mapLocation) {
          setHeadingStatus(await setHeading(panoClient, mapLocation, panorama))
        }
        if (headingStatus) {
          if (mapLocation) {
            if (showStreetView) {
              locationMarkerRef.current = new mapsRef.current.Marker({
                position: mapLocation,
                mapRef,
              })
              locationMarkerRef.current.setMap(panorama)
            }
            panorama.setPosition(mapLocation)
          } else {
            panorama.setPosition(placeholderPlace)
          }

          if (showStreetView) {
            panorama.setOptions({
              disableDefaultUI: true,
              enableCloseButton: false,
            })
          } else {
            if (locationMarkerRef.current) {
              locationMarkerRef.current.setMap(null)
            }
          }
        }
        panorama.setVisible(showStreetView)
        if (panorama.visible && !headingStatus) {
          panorama.setVisible(!showStreetView)
          if (locationMarkerRef.current) {
            locationMarkerRef.current.setMap(null)
          }
        }
      }
    }
    setHeadingWrapper()
  }, [mapLocation, showStreetView, dispatch, headingStatus, mapRef, mapsRef]) //eslint-disable-line

  return null
}

export default PanoramaHandler
