import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { addLocationWithoutPanorama } from '../../redux/miscSlice'
import { useAppHistory } from '../../utils/useAppHistory'

class PanoramaWithMarker {
  constructor(googleMap, googleMaps, location) {
    this.googleMap = googleMap
    this.googleMaps = googleMaps
    this.panorama = null
    this.location = location
    this.marker = null
  }

  async initPanorama() {
    this.panorama = this.googleMap.getStreetView()
    this.panorama.setOptions({
      disableDefaultUI: true,
      enableCloseButton: false,
    })
    this.marker = new this.googleMaps.Marker({
      position: this.location,
    })

    const panoClient = new this.googleMaps.StreetViewService()
    try {
      const panoData = await panoClient.getPanorama({
        location: this.location,
        radius: 50,
      })

      const panoLocation = panoData.data.location.latLng
      const heading = this.googleMaps.geometry.spherical.computeHeading(
        panoLocation,
        this.location,
      )
      this.panorama.setPosition(panoLocation)
      this.panorama.setPov({ heading, pitch: 0 })

      this.panorama.setVisible(true)
      this.marker.setMap(this.panorama)

      // bug: the marker does not immediately appear
      // until the user interacts with the screen
      // programatically jiggle the screen slightly as a workaround
      setTimeout(() => {
        const currentPov = this.panorama.getPov()
        this.panorama.setPov({
          ...currentPov,
          heading: currentPov.heading + 0.1,
        })
        setTimeout(() => {
          this.panorama.setPov(currentPov)
        }, 50)
      }, 100)

      return {}
    } catch (error) {
      return { error }
    }
  }

  disconnect() {
    if (this.panorama) {
      this.panorama.setVisible(false)
    }
    if (this.marker) {
      this.marker.setMap(null)
    }
  }
}

const PanoramaHandler = () => {
  const { t } = useTranslation()
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null
  const { location, streetViewOpen: showStreetView } = useSelector(
    (state) => state.location,
  )
  const history = useAppHistory()
  const dispatch = useDispatch()
  const panoramaWithMarkerRef = useRef(null)

  const connect = async () => {
    if (showStreetView && googleMap && googleMaps && location) {
      panoramaWithMarkerRef.current = new PanoramaWithMarker(
        googleMap,
        googleMaps,
        location,
      )
      const { error } = await panoramaWithMarkerRef.current.initPanorama()
      if (error) {
        toast.error(
          t('error_message.api.street_view_unavailable', { id: location.id }),
        )
        dispatch(addLocationWithoutPanorama(location.id))
        history.push(`/locations/${location.id}`)
      }
    }
  }

  const disconnect = () => {
    if (panoramaWithMarkerRef.current) {
      panoramaWithMarkerRef.current.disconnect()
      panoramaWithMarkerRef.current = null
    }
  }

  useEffect(() => {
    const handleConnection = async () => {
      if (showStreetView) {
        await connect()
      } else {
        disconnect()
      }
    }

    handleConnection()

    return () => {
      disconnect()
    }
  }, [showStreetView, googleMap, googleMaps, location]) //eslint-disable-line

  return null
}

export default PanoramaHandler
