import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import {
  dismissLocationTooltip,
  reopenLocationTooltip,
  updatePosition,
} from '../../redux/locationSlice'
import {
  createDraggablePin,
  createSelectedPin,
  createTooltipOverlay,
} from './createPinMarker'

const PinMarkers = ({
  googleMap,
  getGoogleMaps,
  selectedLocationLat,
  selectedLocationLng,
  isEditing,
  isAdding,
  isDesktop,
  streetViewOpen,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const position = useSelector((state) => state.location.position)
  const tooltipOpen = useSelector((state) => state.location.tooltipOpen)

  const shouldShowDraggableForEditing = isEditing
  const shouldShowDraggableForAdding = isAdding && (isDesktop || streetViewOpen)

  const [draggablePosition, setDraggablePosition] = useState(
    shouldShowDraggableForEditing || shouldShowDraggableForAdding
      ? position
      : null,
  )

  useEffect(() => {
    setDraggablePosition(
      shouldShowDraggableForEditing || shouldShowDraggableForAdding
        ? position
        : null,
    )
  }, [position, shouldShowDraggableForEditing, shouldShowDraggableForAdding])

  const selectedPinRef = useRef(null)
  const draggablePinRef = useRef(null)
  const tooltipOverlayRef = useRef(null)

  const tooltipOpenRef = useRef(tooltipOpen)
  useEffect(() => {
    tooltipOpenRef.current = tooltipOpen
  }, [tooltipOpen])

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return
    }

    const google = getGoogleMaps()

    const hasSelectedLocation =
      selectedLocationLat != null && selectedLocationLng != null

    if (!hasSelectedLocation) {
      if (selectedPinRef.current) {
        selectedPinRef.current.setMap(null)
        selectedPinRef.current = null
      }
      return
    }

    if (!selectedPinRef.current) {
      selectedPinRef.current = createSelectedPin(
        google,
        googleMap,
        { lat: selectedLocationLat, lng: selectedLocationLng },
        { isEditing },
      )
    } else {
      selectedPinRef.current.updatePosition(
        selectedLocationLat,
        selectedLocationLng,
      )
      selectedPinRef.current.updateEditingState(isEditing)

      if (selectedPinRef.current.getMap() !== googleMap) {
        selectedPinRef.current.setMap(googleMap)
      }
    }

    return () => {
      if (selectedPinRef.current) {
        selectedPinRef.current.setMap(null)
        selectedPinRef.current = null
      }
    }
  }, [
    googleMap,
    getGoogleMaps,
    selectedLocationLat,
    selectedLocationLng,
    isEditing,
  ])

  const hasDraggablePosition = Boolean(draggablePosition)

  useEffect(() => {
    if (!googleMap || !getGoogleMaps) {
      return
    }

    const showDraggable =
      (isEditing || (isAdding && (isDesktop || streetViewOpen))) &&
      draggablePosition

    if (!showDraggable) {
      if (draggablePinRef.current) {
        draggablePinRef.current.destroy()
        draggablePinRef.current = null
      }
      if (tooltipOverlayRef.current) {
        tooltipOverlayRef.current.setMap(null)
        tooltipOverlayRef.current = null
      }
      return
    }

    const google = getGoogleMaps()
    const mapTarget = streetViewOpen ? googleMap.getStreetView() : googleMap

    if (!draggablePinRef.current) {
      draggablePinRef.current = createDraggablePin(
        google,
        mapTarget,
        { lat: draggablePosition.lat, lng: draggablePosition.lng },
        {
          isAdding,
          onDragEnd: (newPosition) => {
            dispatch(updatePosition(newPosition))
          },
        },
      )

      draggablePinRef.current._dragListener = google.event.addListener(
        draggablePinRef.current,
        'drag',
        (e) => {
          if (tooltipOverlayRef.current) {
            tooltipOverlayRef.current.updatePosition(
              e.latLng.lat(),
              e.latLng.lng(),
            )
          }
        },
      )

      google.event.addListener(draggablePinRef.current, 'dragend', (e) => {
        if (tooltipOverlayRef.current) {
          tooltipOverlayRef.current.updatePosition(
            e.latLng.lat(),
            e.latLng.lng(),
          )
        }
      })

      google.event.addListener(draggablePinRef.current, 'click', () => {
        dispatch(reopenLocationTooltip())
      })

      if (tooltipOpenRef.current) {
        if (tooltipOverlayRef.current) {
          tooltipOverlayRef.current.setMap(null)
          tooltipOverlayRef.current = null
        }
        tooltipOverlayRef.current = createTooltipOverlay(
          google,
          mapTarget,
          { lat: draggablePosition.lat, lng: draggablePosition.lng },
          streetViewOpen
            ? t('locations.index.editmarker_streetview_html')
            : t('locations.index.editmarker_html'),
          () => dispatch(dismissLocationTooltip()),
        )
      }
    } else {
      if (draggablePinRef.current.getMap() !== mapTarget) {
        draggablePinRef.current.setMap(mapTarget)
      }
    }

    return () => {
      if (draggablePinRef.current) {
        draggablePinRef.current.destroy()
        draggablePinRef.current = null
      }
      if (tooltipOverlayRef.current) {
        tooltipOverlayRef.current.setMap(null)
        tooltipOverlayRef.current = null
      }
    }
    // Note: draggablePosition is intentionally excluded from deps.
    // Position updates are handled by the effect below to avoid
    // destroying/recreating the pin on every position change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    googleMap,
    getGoogleMaps,
    isDesktop,
    streetViewOpen,
    isEditing,
    isAdding,
    hasDraggablePosition,
    dispatch,
    t,
  ])

  useEffect(() => {
    if (!draggablePinRef.current || !draggablePosition) {
      return
    }

    const current = draggablePinRef.current.getPosition()
    const latChanged = Math.abs(current.lat() - draggablePosition.lat) > 1e-9
    const lngChanged = Math.abs(current.lng() - draggablePosition.lng) > 1e-9
    if (latChanged || lngChanged) {
      draggablePinRef.current.updatePosition(
        draggablePosition.lat,
        draggablePosition.lng,
      )
      if (tooltipOverlayRef.current) {
        tooltipOverlayRef.current.updatePosition(
          draggablePosition.lat,
          draggablePosition.lng,
        )
      }
    }
  }, [draggablePosition])

  useEffect(() => {
    if (!googleMap || !getGoogleMaps || !draggablePinRef.current) {
      if (tooltipOverlayRef.current) {
        tooltipOverlayRef.current.setMap(null)
        tooltipOverlayRef.current = null
      }
      return
    }

    const google = getGoogleMaps()
    const mapTarget = streetViewOpen ? googleMap.getStreetView() : googleMap
    const pinPosition = draggablePinRef.current.getPosition()
    const pos = {
      lat: pinPosition.lat(),
      lng: pinPosition.lng(),
    }

    if (tooltipOpen) {
      if (!tooltipOverlayRef.current) {
        tooltipOverlayRef.current = createTooltipOverlay(
          google,
          mapTarget,
          pos,
          streetViewOpen
            ? t('locations.index.editmarker_streetview_html')
            : t('locations.index.editmarker_html'),
          () => dispatch(dismissLocationTooltip()),
        )
      }
    } else {
      if (tooltipOverlayRef.current) {
        tooltipOverlayRef.current.setMap(null)
        tooltipOverlayRef.current = null
      }
    }
  }, [tooltipOpen, googleMap, getGoogleMaps, streetViewOpen, t, dispatch])

  return null
}

export default PinMarkers
