import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { confirmUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'

const ConfirmationPage = () => {
  const history = useAppHistory()

  useEffect(() => {
    const handleConfirmation = async () => {
      const token = new URLSearchParams(window.location.search).get('token')

      if (!token) {
        toast.error("Confirmation token can't be blank", { autoClose: 5000 })
        history.push('/confirmation/new')
      } else {
        try {
          const { email } = await confirmUser(token)
          toast.success('Your email has been confirmed.')
          history.push({ pathname: '/login', state: { email } })
        } catch (e) {
          toast.error(e.response?.data.error, { autoClose: 5000 })
          history.push('/confirmation/new')
        }
      }
    }

    handleConfirmation()
  }, [history])

  return null
}

export default ConfirmationPage
