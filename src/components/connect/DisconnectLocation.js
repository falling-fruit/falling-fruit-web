import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { clearLocation } from '../../redux/locationSlice'

const DisconnectLocation = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(clearLocation())
  }, [dispatch])

  return null
}

export default DisconnectLocation
