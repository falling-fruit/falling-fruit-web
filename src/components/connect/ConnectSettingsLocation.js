import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setFromSettings } from '../../redux/locationSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectSettingsLocation = ({ isSettings }) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (isDesktop) {
      if (isSettings) {
        dispatch(setFromSettings(true))
      }
      return () => {
        if (!window.location.pathname.startsWith('/locations')) {
          dispatch(setFromSettings(false))
        }
      }
    }
  }, [dispatch, isDesktop, isSettings])

  return null
}

export default ConnectSettingsLocation
