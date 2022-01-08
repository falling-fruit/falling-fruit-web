import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'

import { requestResetPassword } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Column } from './AuthWrappers'
import { EmailForm } from './EmailForm'

const PasswordResetPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()

  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  const handleSubmit = async (values) => {
    try {
      await requestResetPassword(values)
      toast.success(
        'You will receive an email with instructions on how to reset your password in a few minutes',
        { autoClose: 5000 },
      )
      history.push('/login')
    } catch (e) {
      toast.error('Email not found')
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageTemplate>
      <h1>Send password reset instructions</h1>
      <EmailForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      <Column>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/confirmation/new">Resend confirmation instructions</Link>
      </Column>
    </PageTemplate>
  )
}

export default PasswordResetPage
