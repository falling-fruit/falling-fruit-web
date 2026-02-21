import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { fetchFilterCounts } from '../../redux/filterSlice'
import { fetchLocations } from '../../redux/viewChange'

const StaleDataWarning = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isStale } = useSelector((state) => state.map)
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
      staleToastIdRef.current = toast.warning(
        t('error_message.stale_map_data.the_warning'),
        {
          autoClose: false,
          toastId: 'stale-data-warning',
        },
      )

      onlineListenerRef.current = () => {
        dispatch(fetchLocations())
        dispatch(fetchFilterCounts())
      }
      window.addEventListener('online', onlineListenerRef.current)
    } else if (!isStale && wasStale === true) {
      toast.dismiss()
      if (staleToastIdRef.current !== null) {
        toast.dismiss(staleToastIdRef.current)
        staleToastIdRef.current = null
      }
      toast.success(t('error_message.stale_map_data.you_are_back_online'))

      removeOnlineListener()
    }
  }, [isStale, t]) //eslint-disable-line

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
