import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { MapType } from '../../constants/settings'
import { addLocationWithoutPanorama } from '../../redux/miscSlice'
import { getDisplayLabel } from '../../utils/getDisplayLabel'
import { useAppHistory } from '../../utils/useAppHistory'
import {
  createLabel,
  formatLabelHtml,
  getMarkerIcon,
  Z_INDEX,
} from './locationMarkerHelpers'

// The orange "here" pin drawn above the selected location's dot. Uses the same
// boxicons Map glyph (in theme.orange) as the map's MapPin in Pins.js, anchored
// at the tip so it floats above the dot.
const getSelectedPinIcon = (googleMaps) => ({
  url: '/selected_location_pin.svg',
  scaledSize: new googleMaps.Size(48, 48),
  anchor: new googleMaps.Point(24, 44),
})

// Dedupe the nearby locations by id (the viewed location may also appear in
// the map's location list).
const dedupeLocations = (mapLocations, centerLocation) => {
  const byId = new Map()
  const add = (loc) => {
    if (loc && loc.id != null && loc.lat != null && loc.lng != null) {
      byId.set(loc.id, loc)
    }
  }
  ;(mapLocations || []).forEach(add)
  add(centerLocation)
  return [...byId.values()]
}

// Draws the same dot markers and labels as the map (LocationMarkers) onto the
// Street View panorama, so both views look identical. The selected (viewed)
// location additionally gets the orange "here" pin above its dot, mirroring
// the map's SelectedLocation pin.
class PanoramaWithMarkers {
  constructor(googleMap, googleMaps, options) {
    this.googleMap = googleMap
    this.googleMaps = googleMaps
    this.centerLocation = options.centerLocation
    this.locations = options.locations
    this.selectedLocationId = options.selectedLocationId
    this.typesAccess = options.typesAccess
    this.selectedTypes = options.selectedTypes
    this.panorama = null
    this.markers = []
    this.labels = []
    this.cancelled = false
  }

  createOverlays() {
    const google = this.googleMaps
    this.locations.forEach((location) => {
      const isSaved = Boolean(location.in_list)
      const isSelected = location.id === this.selectedLocationId
      const position = { lat: location.lat, lng: location.lng }

      // Same dot as the map (blue by default, orange when saved).
      const marker = new google.Marker({
        position,
        icon: getMarkerIcon(google, isSaved),
        zIndex: isSaved ? Z_INDEX.SAVED : Z_INDEX.DEFAULT,
      })
      marker.setMap(this.panorama)
      this.markers.push(marker)

      // The selected location also gets the orange "here" pin above its dot.
      if (isSelected) {
        const pin = new google.Marker({
          position,
          icon: getSelectedPinIcon(google),
          zIndex: Z_INDEX.SAVED + 1,
        })
        pin.setMap(this.panorama)
        this.markers.push(pin)
      }

      const labelData = (location.type_ids || [])
        .map((id) => getDisplayLabel(this.typesAccess, id))
        .filter(Boolean)
      if (labelData.length > 0) {
        const labelHtml = formatLabelHtml(labelData, this.selectedTypes)
        // Always use the satellite/hybrid label style (white text, dark
        // outline) since the panorama is imagery — more readable than the
        // road-map style regardless of the map's current type.
        const label = createLabel(
          google,
          this.panorama,
          location,
          labelHtml,
          false,
          MapType.Hybrid,
          isSaved,
        )
        this.labels.push(label)
      }
    })
  }

  async initPanorama() {
    this.panorama = this.googleMap.getStreetView()
    this.panorama.setOptions({
      disableDefaultUI: true,
      enableCloseButton: false,
    })

    const panoClient = new this.googleMaps.StreetViewService()
    try {
      const panoData = await panoClient.getPanorama({
        location: this.centerLocation,
        radius: 50,
      })

      // disconnect() may have run while we awaited getPanorama (a newer
      // panorama superseded us). Bail before touching the shared panorama or
      // creating overlays that nothing would clean up.
      if (this.cancelled) {
        return {}
      }

      const panoLocation = panoData.data.location.latLng
      const heading = this.googleMaps.geometry.spherical.computeHeading(
        panoLocation,
        this.centerLocation,
      )
      this.panorama.setPosition(panoLocation)
      this.panorama.setPov({ heading, pitch: 0 })

      this.panorama.setVisible(true)
      this.createOverlays()

      // bug: the markers do not immediately appear
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
    this.cancelled = true
    if (this.panorama) {
      this.panorama.setVisible(false)
    }
    this.markers.forEach((marker) => marker.setMap(null))
    this.labels.forEach((label) => label.setMap(null))
    this.markers = []
    this.labels = []
  }
}

const PanoramaHandler = () => {
  const { t } = useTranslation()
  const {
    googleMap,
    getGoogleMaps,
    locations: mapLocations,
  } = useSelector((state) => state.map)
  const googleMaps = getGoogleMaps ? getGoogleMaps() : null
  const { location, streetViewOpen: showStreetView } = useSelector(
    (state) => state.location,
  )
  const typesAccess = useSelector((state) => state.type.typesAccess)
  const { types: selectedTypes } = useSelector((state) => state.filter)
  const history = useAppHistory()
  const dispatch = useDispatch()
  const panoramaWithMarkerRef = useRef(null)

  const connect = async () => {
    if (showStreetView && googleMap && googleMaps && location) {
      const instance = new PanoramaWithMarkers(googleMap, googleMaps, {
        centerLocation: location,
        locations: dedupeLocations(mapLocations, location),
        selectedLocationId: location.id,
        typesAccess,
        selectedTypes,
      })
      panoramaWithMarkerRef.current = instance
      const { error } = await instance.initPanorama()
      // A newer connect()/disconnect() superseded us while awaiting; bail so we
      // don't toast or navigate for a panorama that is no longer current.
      if (panoramaWithMarkerRef.current !== instance) {
        return
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showStreetView,
    googleMap,
    googleMaps,
    location,
    typesAccess,
    mapLocations,
    selectedTypes,
  ])

  return null
}

export default PanoramaHandler
