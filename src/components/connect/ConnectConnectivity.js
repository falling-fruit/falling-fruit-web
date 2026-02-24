import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { fetchFilterCounts } from '../../redux/filterSlice'
import {
  fetchListLocationsStart,
  markShouldFetchNewLocations,
} from '../../redux/listSlice'
import { fetchLocations } from '../../redux/viewChange'

const ConnectivityWarning = ({ isListPage }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isOffline } = useSelector((state) => state.connectivity)
  const offlineToastIdRef = useRef(null)
  const prevIsOfflineRef = useRef(null)
  const onlineListenerRef = useRef(null)

  const removeOnlineListener = () => {
    if (onlineListenerRef.current !== null) {
      window.removeEventListener('online', onlineListenerRef.current)
      onlineListenerRef.current = null
    }
  }

  useEffect(() => {
    const wasOffline = prevIsOfflineRef.current
    prevIsOfflineRef.current = isOffline

    if (isOffline && offlineToastIdRef.current === null) {
      offlineToastIdRef.current = toast.warning(
        t('error_message.connectivity.you_are_offline'),
        {
          autoClose: false,
          toastId: 'connectivity-warning',
        },
      )

      onlineListenerRef.current = () => {
        dispatch(fetchFilterCounts())
        dispatch(fetchLocations())
        if (isListPage) {
          dispatch(fetchListLocationsStart())
        } else {
          dispatch(markShouldFetchNewLocations())
        }
      }
      window.addEventListener('online', onlineListenerRef.current)
    } else if (!isOffline && wasOffline === true) {
      toast.dismiss()
      if (offlineToastIdRef.current !== null) {
        toast.dismiss(offlineToastIdRef.current)
        offlineToastIdRef.current = null
      }
      toast.success(t('error_message.connectivity.you_are_back_online'))

      removeOnlineListener()
    }
  }, [isOffline, t]) //eslint-disable-line

  useEffect(
    () => () => {
      if (offlineToastIdRef.current !== null) {
        toast.dismiss(offlineToastIdRef.current)
        offlineToastIdRef.current = null
      }
      removeOnlineListener()
    },
    [], //eslint-disable-line
  )

  return null
}

export default ConnectivityWarning
