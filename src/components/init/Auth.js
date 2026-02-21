import i18next from 'i18next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { checkAuth } from '../../redux/authSlice'
import { pathToSignInPage } from '../../utils/appUrl'
import isNetworkError from '../../utils/isNetworkError'
import { useAppHistory } from '../../utils/useAppHistory'
import useShareUrl from '../share/useShareUrl'

const AuthInitializer = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()
  const shareUrl = useShareUrl()

  useEffect(() => {
    dispatch(checkAuth())
      .unwrap()
      .then(([_user, error, _hadToken]) => {
        if (error) {
          if (error.message === 'Invalid refresh token') {
            history.push(pathToSignInPage())
          } else if (error.message === 'Expired refresh token') {
            toast.info(i18next.t('error_message.auth.expired_refresh_token'))
            history.push(pathToSignInPage())
          } else if (isNetworkError(error)) {
            console.error(error)
            history.push('/error/offline', {
              fromPage: shareUrl,
            })
          } else {
            history.push('/error/fatal', {
              errorMessage:
                error.message || i18next.t('error_message.unknown_error'),
              fromPage: shareUrl,
            })
          }
        }
      })
  }, [dispatch]) // eslint-disable-line

  return null
}

export default AuthInitializer
