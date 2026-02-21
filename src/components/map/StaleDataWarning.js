import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const StaleDataWarning = () => {
  const { t } = useTranslation()
  const isStale = useSelector((state) => state.map.isStale)
  const staleToastIdRef = useRef(null)
  const prevIsStaleRef = useRef(null)

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
    }
  }, [isStale, t])

  // Dismiss stale toast on unmount
  useEffect(() => () => {
      if (staleToastIdRef.current !== null) {
        toast.dismiss(staleToastIdRef.current)
        staleToastIdRef.current = null
      }
    }, [])

  return null
}

export default StaleDataWarning
