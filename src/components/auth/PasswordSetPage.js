import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { resetPassword } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { Column, FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const getResetToken = () =>
  new URLSearchParams(window.location.search).get('token')

const PasswordSetPage = () => {
  const history = useAppHistory()
  const { user, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!getResetToken()) {
      toast.error(
        "You can't access this page without coming from a password reset email. If you do come from a password reset email, please make sure you used the full URL provided.",
        { autoClose: 5000 },
      )
      history.push('/login')
    }
  }, [history])

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  const handleSubmit = async ({ new_password }) => {
    try {
      const { email } = await resetPassword({
        password: new_password,
        token: getResetToken(),
      })
      toast.success('Your password has been changed successfully.', {
        autoClose: 5000,
      })
      history.push({ pathname: '/login', state: { email } })
    } catch (e) {
      toast.error('Invalid password reset link')
      console.error(e.response)
      history.push('/login')
    }
  }

  return (
    <PageTemplate>
      <h1>Change my password</h1>
      <Formik
        initialValues={{
          new_password: '',
          new_password_confirm: '',
        }}
        validationSchema={Yup.object({
          new_password: Yup.string().min(6).required(),
          new_password_confirm: Yup.string()
            .oneOf([Yup.ref('new_password')])
            .required('Passwords must match'),
        })}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid, isSubmitting }) => (
          <Form>
            <FormInputWrapper>
              <Input name="new_password" label="New Password" type="password" />
              <Input
                name="new_password_confirm"
                label="Confirm New Password"
                type="password"
              />
            </FormInputWrapper>

            <FormButtonWrapper>
              <Button
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Changing' : 'Change my password'}
              </Button>
            </FormButtonWrapper>
          </Form>
        )}
      </Formik>
      <Column>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/confirmation/resend">Resend confirmation instructions</Link>
      </Column>
    </PageTemplate>
  )
}

export default PasswordSetPage
