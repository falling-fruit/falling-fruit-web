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
  const { initialView, googleMap } = useSelector((state) => state.map)
  const { position } = useSelector((state) => state.location)
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    dispatch(
      fetchLocationData({ locationId, isBeingEdited, isStreetView }),
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

  useEffect(
    () => {
      if (
        isBeingEdited &&
        isBeingEditedDetails &&
        position &&
        !isDesktop &&
        googleMap
      ) {
        // On mobile, we need to center the map on the edited location
        // because the UX involves panning the map under a central pin
        //
        // do this when navigating to /locations/:locationId/edit/details
        // (necessarily visited before /locations/:locationId/edit/position)
        googleMap.setCenter(position)
        if (googleMap.getZoom() < 16) {
          googleMap.setZoom(16)
        }
      }
    },
    //eslint-disable-next-line
    [
      dispatch,
      isBeingEdited,
      isBeingEditedDetails,
      locationId,
      isDesktop,
      googleMap,
    ],
  )

  return null
}

export default ConnectLocation
