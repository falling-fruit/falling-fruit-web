import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setIsBeingInitializedMobile } from '../../redux/locationSlice'

const DisconnectInitLocation = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setIsBeingInitializedMobile(false))
  }, [dispatch])

  return null
}

export default DisconnectInitLocation
