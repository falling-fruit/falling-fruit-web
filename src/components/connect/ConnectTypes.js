import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { fetchAndLocalizeTypes } from '../../redux/typeSlice'
import { useAppHistory } from '../../utils/useAppHistory'

const ConnectTypes = () => {
  const { i18n, t } = useTranslation()
  const language = i18n.language
  const dispatch = useDispatch()
  const history = useAppHistory()

  useEffect(() => {
    dispatch(fetchAndLocalizeTypes(language))
      .unwrap()
      .catch((error) => {
        if (
          !navigator.onLine ||
          error.message === 'Network Error' ||
          error.message === 'Failed to fetch'
        ) {
          history.push('/error/offline')
        } else {
          history.push('/error/fatal', {
            errorMessage: error.message || t('error_message.unknown_error'),
          })
        }
      })
  }, [dispatch, language, history, t])

  return null
}
export default ConnectTypes
