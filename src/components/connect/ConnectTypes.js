import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import useShareUrl from '../share/useShareUrl'

const ConnectTypes = () => {
  const { i18n, t } = useTranslation()
  const language = i18n.language
  const dispatch = useDispatch()
  const history = useAppHistory()
  const shareUrl = useShareUrl()

  useEffect(() => {
    dispatch(fetchAndLocalizeTypes(language))
      .unwrap()
      .catch((error) => {
        if (
          !navigator.onLine ||
          error.message === 'Network Error' ||
          error.message === 'Failed to fetch'
        ) {
          history.push('/error/offline', {
            fromPage: shareUrl,
          })
        } else {
          history.push('/error/fatal', {
            errorMessage: error.message || t('error_message.unknown_error'),
            fromPage: shareUrl,
          })
        }
      })
  }, [dispatch, language]) //eslint-disable-line

  return null
}
export default ConnectTypes
