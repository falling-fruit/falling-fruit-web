import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchLocationData,
  setIsBeingEditedAndResetPosition,
} from '../../redux/locationSlice'
import { setView } from '../../redux/mapSlice'
import { currentPathWithView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectLocation = ({ locationId, isBeingEdited }) => {
  const dispatch = useDispatch()
  const view = useSelector((state) => state.map.view)
  const position = useSelector((state) => state.location.position)
  const history = useAppHistory()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    dispatch(fetchLocationData({ locationId, isBeingEdited })).then(
      (action) => {
        if (action.payload && !view) {
          // TODO: the view could be null because it wasn't set yet but present in coords
          // use parseCurrentUrl instead
          // old comment:
          // If the view is null
          // (e.g. we navigated to /locations/:locationId in the browser)
          // set it to the centre of the retrieved location
          const newView = {
            center: {
              lat: action.payload.lat,
              lng: action.payload.lng,
            },
            zoom: 16,
          }
          dispatch(setView(newView))
          // and navigate to the page with the new URL
          // to trigger component reload
          const newUrl = currentPathWithView(newView)
          history.push(newUrl)
        }
      },
    )
  }, [dispatch, locationId]) //eslint-disable-line

  useEffect(() => {
    dispatch(setIsBeingEditedAndResetPosition(isBeingEdited))
  }, [dispatch, isBeingEdited])

  useEffect(() => {
    if (isBeingEdited && position && !isDesktop) {
      // On mobile, we need to center the map on the edited location
      // because the UX involves panning the map under a central pin
      dispatch(
        setView({
          center: {
            lat: position.lat,
            lng: position.lng,
          },
          zoom: Math.max(view ? view.zoom : 0, 16),
        }),
      )
    }
  }, [dispatch, isBeingEdited, locationId, isDesktop]) //eslint-disable-line

  return null
}

export default ConnectLocation
