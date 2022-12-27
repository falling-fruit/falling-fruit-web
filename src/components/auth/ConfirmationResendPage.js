import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'

import { requestConfirmUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Column } from './AuthWrappers'
import { EmailForm } from './EmailForm'

const ConfirmationResendPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()

  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && user) {
    toast.info('You are already signed in.')
    return <Redirect to="/map" />
  }

  const handleSubmit = async (values) => {
    try {
      await requestConfirmUser(values)
      toast.success(
        'You will receive an email with instructions for how to confirm your email address in a few minutes',
        { autoClose: 5000 },
      )
      history.push('/users/sign_in')
    } catch (e) {
      toast.error(e.response?.data.error)
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageTemplate>
      <h1>Resend confirmation instructions</h1>
      <EmailForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      <Column>
        <Link to="/users/sign_in">Login</Link>
        <Link to="/users/sign_up">Sign up</Link>
        <Link to="/users/confirmation/new">
          Resend confirmation instructions
        </Link>
      </Column>
    </PageTemplate>
  )
}

export default ConfirmationResendPage
