import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchLocationData,
  setIsBeingEditedAndResetPosition,
  setStreetView,
} from '../../redux/locationSlice'
import { setInitialView } from '../../redux/mapSlice'
import { currentPathWithView, parseCurrentUrl } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectLocation = ({
  locationId,
  isBeingEdited,
  isBeingEditedPosition,
  isStreetView,
  paneDrawerDisabled,
}) => {
  const dispatch = useDispatch()
  const { initialView, googleMap } = useSelector((state) => state.map)
  const { position } = useSelector((state) => state.location)
  const history = useAppHistory()
  const isDesktop = useIsDesktop()
  const [hasCentered, setHasCentered] = useState(false)

  useEffect(() => {
    dispatch(
      fetchLocationData({
        locationId,
        isBeingEdited,
        isStreetView,
        paneDrawerDisabled,
      }),
    ).then((action) => {
      if (action.payload && !initialView) {
        const { view: viewUrl } = parseCurrentUrl()
        const view = viewUrl || {
          center: {
            lat: action.payload.lat,
            lng: action.payload.lng,
          },
          zoom: 16,
        }
        dispatch(setInitialView(view))
        // navigate to the page with the new URL
        // to trigger component reload
        const newUrl = currentPathWithView(view)
        history.push(newUrl)
      }
    })
  }, [dispatch, locationId]) //eslint-disable-line

  useEffect(() => {
    dispatch(setIsBeingEditedAndResetPosition(isBeingEdited))
  }, [dispatch, isBeingEdited])

  useEffect(() => {
    dispatch(setStreetView(isStreetView))
  }, [dispatch, isStreetView])

  useEffect(() => {
    if (
      isBeingEdited &&
      isBeingEditedPosition &&
      position &&
      !isDesktop &&
      googleMap &&
      !hasCentered
    ) {
      // On mobile, we need to center the map on the edited location
      // because the UX involves panning the map under a central pin
      googleMap.setCenter(position)
      if (googleMap.getZoom() < 16) {
        googleMap.setZoom(16)
      }
      setHasCentered(true)
    }
  }, [
    isBeingEdited,
    isBeingEditedPosition,
    position,
    isDesktop,
    googleMap,
    hasCentered,
  ])

  useEffect(() => {
    // Reset hasCentered when locationId changes
    setHasCentered(false)
  }, [locationId])

  return null
}

export default ConnectLocation
