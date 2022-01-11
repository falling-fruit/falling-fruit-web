import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect, useLocation } from 'react-router-dom'
import * as Yup from 'yup'

import { login } from '../../redux/authSlice'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import { Checkbox, Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import {
  Column,
  ErrorMessage,
  FormButtonWrapper,
  FormCheckboxWrapper,
  FormInputWrapper,
} from './AuthWrappers'

const LoginPage = () => {
  const { user, isLoading } = useSelector((state) => state.auth)
  const error = useSelector((state) => state.auth.error)
  console.error(error)
  const { state } = useLocation()

  const dispatch = useDispatch()

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <h1>Login</h1>
        <Formik
          initialValues={{
            email: state?.email ?? '',
            password: '',
            rememberMe: false,
          }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
            rememberMe: Yup.boolean().required(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(login(values))
            setSubmitting(false)
          }}
        >
          {({ isValid }) => (
            <Form>
              <FormInputWrapper>
                <Input type="text" name="email" label="Email" />
                <Input name="password" label="Password" type="password" />
              </FormInputWrapper>
              {error && (
                <ErrorMessage>{error.response.data.error}</ErrorMessage>
              )}
              {/* TODO: missing all errors */}

              <FormCheckboxWrapper>
                <LabeledRow
                  label={<label htmlFor="rememberMe">Remember Me</label>}
                  left={<Checkbox name="rememberMe" />}
                />
              </FormCheckboxWrapper>

              <FormButtonWrapper>
                <Button disabled={!isValid || isLoading} type="submit">
                  {isLoading ? 'Logging in' : 'Login'}
                </Button>
              </FormButtonWrapper>
            </Form>
          )}
        </Formik>
        <Column>
          <Link to="/signup">Sign up</Link>
          <Link to="/password/reset">Reset your password</Link>
          <Link to="/confirmation/new">Resend confirmation instructions</Link>
        </Column>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default LoginPage
