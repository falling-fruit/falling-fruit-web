import { useEffect } from 'react'
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
  isBeingEditedDetails,
  isStreetView,
}) => {
  const dispatch = useDispatch()
  const { googleMap } = useSelector((state) => state.map)
  const { position } = useSelector((state) => state.location)
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    dispatch(
      fetchLocationData({ locationId, isBeingEdited, isStreetView }),
    ).then((action) => {
      if (action.payload && !googleMap) {
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
    if (isBeingEdited && isBeingEditedDetails && position && !isDesktop) {
      // On mobile, we need to center the map on the edited location
      // because the UX involves panning the map under a central pin
      //
      // do this after navigating to the form, since when we're editing position
      // we might want to roundtrip to settings
      dispatch(
        setInitialView({
          center: {
            lat: position.lat,
            lng: position.lng,
          },
          zoom: Math.max(googleMap ? googleMap.getZoom() : 0, 16),
        }),
      )
    }
  }, [dispatch, isBeingEdited, isBeingEditedDetails, locationId, isDesktop]) //eslint-disable-line

  return null
}

export default ConnectLocation
