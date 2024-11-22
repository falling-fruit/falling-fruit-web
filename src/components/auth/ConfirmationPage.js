import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { confirmUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'

const ConfirmationPage = () => {
  const history = useAppHistory()
  const { t } = useTranslation()

  useEffect(() => {
    const handleConfirmation = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

      if (!token) {
        toast.error(t('devise.confirmations.no_token'), { autoClose: 5000 })
        history.push('/users/confirmation/new')
      } else {
        try {
          const { email } = await confirmUser(token)
          toast.success(t('devise.confirmations.confirmed'))
          history.push({ pathname: '/users/sign_in', state: { email } })
        } catch (error) {
          toast.error(
            `Account confirmation failed: ${error.message || 'Unknown error'}`,
            { autoClose: 5000 },
          )
          history.push('/users/confirmation/new')
        }
      }
    }

    handleConfirmation()
  }, [history, t])

  return null
}

export default ConfirmationPage
