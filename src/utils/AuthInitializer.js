import i18next from 'i18next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { checkAuth } from '../redux/authSlice'
import { pathToSignInPage } from './appUrl'
import { useAppHistory } from './useAppHistory'

const AuthInitializer = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()

  useEffect(() => {
    dispatch(checkAuth())
      .unwrap()
      .then(([_user, error]) => {
        if (error) {
          if (error.message === 'Invalid refresh token') {
            history.push(pathToSignInPage())
          } else {
            toast.error(
              i18next.t('error_message.auth.check_failed', {
                message:
                  error.message || i18next.t('error_message.unknown_error'),
              }),
            )
          }
        }
      })
  }, [dispatch]) // eslint-disable-line

  return null
}

export default AuthInitializer
