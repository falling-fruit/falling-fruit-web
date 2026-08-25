import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  setIsBeingInitializedMobile,
  updatePosition,
} from '../../redux/locationSlice'

const DisconnectInitLocation = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setIsBeingInitializedMobile(false))
    dispatch(updatePosition(null))
  }, [dispatch])

  return null
}

export default DisconnectInitLocation
