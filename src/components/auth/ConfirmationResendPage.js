import { Form, Formik } from 'formik'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { requestConfirmUser } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Input, Recaptcha } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { Column, FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const ConfirmationResendPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()

  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  const handleSubmit = async (values) => {
    try {
      await requestConfirmUser(values)
      toast.success(
        'You will receive an email with instructions for how to confirm your email address in a few minutes',
        { autoClose: 5000 },
      )
      history.push('/login')
    } catch (e) {
      toast.error(e.response?.data.error)
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageTemplate>
      <h1>Resend confirmation instructions</h1>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
          'g-recaptcha-response': Yup.string().required(),
        })}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid, isSubmitting }) => (
          <Form>
            <FormInputWrapper>
              <Input type="text" name="email" label="Email" />
            </FormInputWrapper>

            <Recaptcha
              name="g-recaptcha-response"
              ref={(e) => {
                recaptchaRef.current = e
              }}
            />

            <FormButtonWrapper>
              <Button
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Sending' : 'Send'}
              </Button>
            </FormButtonWrapper>
          </Form>
        )}
      </Formik>
      <Column>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
        <Link to="/confirmation/new">Resend confirmation instructions</Link>
      </Column>
    </PageTemplate>
  )
}

export default ConfirmationResendPage
