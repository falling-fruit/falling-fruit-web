import i18next from 'i18next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { checkAuth } from '../../redux/authSlice'
import { pathToSignInPage } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'

const AuthInitializer = () => {
  const dispatch = useDispatch()
  const history = useAppHistory()

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
