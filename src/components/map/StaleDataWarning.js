import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { fetchFilterCounts } from '../../redux/filterSlice'
import { fetchLocations } from '../../redux/viewChange'

const StaleDataWarning = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isStale = useSelector((state) => state.map.isStale)
  const staleToastIdRef = useRef(null)
  const prevIsStaleRef = useRef(null)
  const onlineListenerRef = useRef(null)

  const removeOnlineListener = () => {
    if (onlineListenerRef.current !== null) {
      window.removeEventListener('online', onlineListenerRef.current)
      onlineListenerRef.current = null
    }
  }

  useEffect(() => {
    const wasStale = prevIsStaleRef.current
    prevIsStaleRef.current = isStale

    if (isStale && staleToastIdRef.current === null) {
      // Show a non-auto-dismissable warning toast
      staleToastIdRef.current = toast.warning(
        t(
          'map.stale_data_warning',
          'Map data may be out of date due to a network error.',
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
          toastId: 'stale-data-warning',
        },
      )

      // Watch for the internet coming back and re-fetch locations
      onlineListenerRef.current = () => {
        dispatch(fetchLocations())
        dispatch(fetchFilterCounts())
      }
      window.addEventListener('online', onlineListenerRef.current)
    } else if (!isStale && wasStale === true) {
      // Dismiss the stale warning and show a success toast
      if (staleToastIdRef.current !== null) {
        toast.dismiss(staleToastIdRef.current)
        staleToastIdRef.current = null
      }
      toast.success(
        t('map.back_online', 'Back online — map data has been refreshed.'),
        {
          autoClose: 4000,
          toastId: 'back-online',
        },
      )

      // No longer stale, so stop listening for online events
      removeOnlineListener()
    }
  }, [isStale, t]) //eslint-disable-line

  // Dismiss stale toast and remove online listener on unmount
  useEffect(
    () => () => {
      if (staleToastIdRef.current !== null) {
        toast.dismiss(staleToastIdRef.current)
        staleToastIdRef.current = null
      }
      removeOnlineListener()
    },
    [], //eslint-disable-line
  )

  return null
}

export default StaleDataWarning
