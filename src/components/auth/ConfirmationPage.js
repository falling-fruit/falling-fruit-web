import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { confirmUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { withAuthRedirect } from './withAuthRedirect'

const ConfirmationPage = () => {
  const history = useAppHistory()
  const { t } = useTranslation()

  useEffect(() => {
    const handleConfirmation = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

      if (!token) {
        toast.error(t('devise.confirmations.no_token'), { autoClose: 5000 })
        history.push('/auth/confirmation/new')
      } else {
        try {
          const { email } = await confirmUser(token)
          history.removeParam('token')
          toast.success(t('devise.confirmations.confirmed'))
          history.push({ pathname: '/auth/sign_in', state: { email } })
        } catch (error) {
          history.removeParam('token')
          toast.error(
            t('error_message.auth.confirmation_failed', {
              message: error.message || t('error_message.unknown_error'),
            }),
            { autoClose: 5000 },
          )
          history.push('/auth/confirmation/new')
        }
      }
    }

    handleConfirmation()
  }, []) //eslint-disable-line

  return null
}

export default withAuthRedirect(ConfirmationPage)
