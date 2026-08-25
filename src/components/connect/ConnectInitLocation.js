import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  setIsBeingInitializedMobile,
  updatePosition,
} from '../../redux/locationSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'

const ConnectInitLocation = () => {
  const isDesktop = useIsDesktop()
  const history = useAppHistory()
  const dispatch = useDispatch()
  const location = useLocation()
  const { googleMap } = useSelector((state) => state.map)
  const { position } = useSelector((state) => state.location)
  const isSettingsPage = location.pathname.startsWith('/settings')

  useEffect(() => {
    if (isSettingsPage) {
      return
    }

    if (isDesktop) {
      history.push('/locations/new')
      return
    }

    dispatch(setIsBeingInitializedMobile(true))
  }, [isDesktop, dispatch, isSettingsPage]) //eslint-disable-line

  // Set the initial marker position from map center only once (when position is not yet set)
  useEffect(() => {
    if (!isSettingsPage && !isDesktop && !position && googleMap) {
      const center = googleMap.getCenter()
      dispatch(updatePosition({ lat: center.lat(), lng: center.lng() }))
    }
  }, [isSettingsPage, isDesktop, position, googleMap, dispatch])

  return null
}

export default ConnectInitLocation
