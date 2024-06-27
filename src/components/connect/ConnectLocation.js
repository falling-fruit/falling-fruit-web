import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchLocationData, setNewLocation } from '../../redux/locationSlice'

const ConnectLocation = ({locationId}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (locationId === 'new') {
      dispatch(setNewLocation())
    } else {
      dispatch(fetchLocationData(locationId))
    }
  }, [dispatch, locationId])
  return null
}

export default ConnectLocation
