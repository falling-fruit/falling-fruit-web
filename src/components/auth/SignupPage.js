import { Form, Formik } from 'formik'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components/macro'
import * as Yup from 'yup'

import { addUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import { Input, Recaptcha, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const LoginNotice = styled.p`
  margin-top: -1.5em;
`

const formToUser = (form) => ({ ...form, password_confirm: undefined })

const SignupPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()

  const isLoading = useSelector((state) => state.auth.isLoading)
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  if (!isLoading && isLoggedIn) {
    history.push('/map')
    return
  }

  const handleSubmit = async (values) => {
    const newUser = formToUser(values)

    let response
    try {
      response = await addUser(newUser)
      toast.success(`Sign up successful! ${response.message}`, {
        autoClose: 5000,
      })
      history.push('/map')
    } catch (e) {
      toast.error(`Sign up failed: ${e.response?.data?.error}`)
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <h1>Sign up</h1>
        <LoginNotice>
          Have an account? <Link to="/users/sign_in">Login</Link>
        </LoginNotice>

        <Formik
          initialValues={{
            email: '',
            password: '',
            password_confirm: '',
            name: '',
            bio: '',
          }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            password_confirm: Yup.string()
              .oneOf([Yup.ref('password')])
              .required('Passwords must match'),
            name: Yup.string(),
            bio: Yup.string(),
            'g-recaptcha-response': Yup.string().required(),
          })}
          onSubmit={handleSubmit}
        >
          {({ dirty, isValid, isSubmitting }) => (
            <Form>
              <FormInputWrapper>
                <Input type="text" name="email" label="Email" />

                {/* TODO: need designs for this information */}
                <p>Password must be at least 6 characters long.</p>

                <Input name="password" label="Password" type="password" />
                <Input
                  name="password_confirm"
                  label="Confirm Password"
                  type="password"
                />

                <Input type="text" name="name" label="Name" optional />

                <Textarea name="bio" label="About You" optional />
              </FormInputWrapper>

              <Recaptcha
                name="g-recaptcha-response"
                ref={(e) => {
                  recaptchaRef.current = e
                }}
              />

              <FormButtonWrapper>
                <Button secondary type="reset">
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {isSubmitting ? 'Signing up' : 'Sign up'}
                </Button>
              </FormButtonWrapper>
            </Form>
          )}
        </Formik>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default SignupPage
