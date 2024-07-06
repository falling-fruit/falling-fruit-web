import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchLocationData,
  initNewLocation,
  setIsBeingEdited,
} from '../../redux/locationSlice'
import { setView } from '../../redux/mapSlice'
import { parseUrl } from '../../utils/getInitialUrl'

const ConnectLocation = ({ locationId, isBeingEdited }) => {
  const dispatch = useDispatch()
  const view = useSelector((state) => state.map.view)
  const position = useSelector((state) => state.location.position)

  useEffect(() => {
    if (locationId === 'new') {
      dispatch(initNewLocation(parseUrl().center))
    }
  }, [dispatch, locationId])

  useEffect(() => {
    if (locationId !== 'new') {
      dispatch(fetchLocationData({ locationId, isBeingEdited })).then(
        (action) => {
          if (action.payload && !view) {
            dispatch(
              setView({
                center: {
                  lat: action.payload.lat,
                  lng: action.payload.lng,
                },
                zoom: 16,
              }),
            )
          }
        },
      )
    }
  }, [dispatch, locationId]) //eslint-disable-line

  useEffect(() => {
    dispatch(setIsBeingEdited(isBeingEdited))
  }, [dispatch, isBeingEdited])

  useEffect(() => {
    if (isBeingEdited && position) {
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
  }, [dispatch, isBeingEdited]) //eslint-disable-line
  return null
}

export default ConnectLocation
