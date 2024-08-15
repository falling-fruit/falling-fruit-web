import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearLocation } from '../../redux/locationSlice'

const DisconnectLocation = () => {
  const dispatch = useDispatch()
  const { locationId } = useSelector((state) => state.location)

  useEffect(() => {
    if (locationId) {
      dispatch(clearLocation())
    }
  }, [dispatch, locationId])

  return null
}

export default DisconnectLocation
