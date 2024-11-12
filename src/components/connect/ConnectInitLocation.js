import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { setIsBeingInitializedMobile } from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectInitLocation = () => {
  const isDesktop = useIsDesktop()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const location = useLocation()
  const isSettingsPage = location.pathname.startsWith('/settings')

  useEffect(() => {
    if (!isSettingsPage) {
      if (isDesktop) {
        history.push('/locations/new')
        return
      }

      dispatch(setIsBeingInitializedMobile(true))
    }
  }, [history, isDesktop, dispatch, isSettingsPage])

  return null
}

export default ConnectInitLocation
