import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setIsBeingInitializedMobile } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectInitLocation = () => {
  const isDesktop = useIsDesktop()
  const history = useAppHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isDesktop) {
      history.push('/locations/new')
      return
    }

    dispatch(setIsBeingInitializedMobile(true))
    return () => {
      dispatch(setIsBeingInitializedMobile(false))
    }
  }, [history, isDesktop, dispatch])

  return null
}

export default ConnectInitLocation
