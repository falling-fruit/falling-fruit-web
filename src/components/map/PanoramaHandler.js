import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

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

      this.marker.setMap(this.panorama)
      const panoLocation = panoData.data.location.latLng
      const heading = this.googleMaps.geometry.spherical.computeHeading(
        panoLocation,
        this.location,
      )
      this.panorama.setPosition(panoLocation)
      this.panorama.setPov({ heading, pitch: 0 })
      this.panorama.setVisible(true)
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
  const { googleMap, getGoogleMaps } = useSelector((state) => state.map)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null
  const { location, streetViewOpen: showStreetView } = useSelector(
    (state) => state.location,
  )
  const history = useAppHistory()
  const panoramaWithMarkerRef = useRef(null)

  const connect = () => {
    if (showStreetView && googleMap && googleMaps && location) {
      panoramaWithMarkerRef.current = new PanoramaWithMarker(
        googleMap,
        googleMaps,
        location,
      )
      const { error } = panoramaWithMarkerRef.current.initPanorama()
      if (error) {
        console.error(error)
        toast.error(`Street View not available for location ${location.id}`)
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
    if (showStreetView) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [showStreetView, googleMap, googleMaps, location]) //eslint-disable-line

  return null
}

export default PanoramaHandler
