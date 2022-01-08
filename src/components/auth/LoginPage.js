import { ErrorMessage, Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import * as Yup from 'yup'

import { login } from '../../redux/authSlice'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { PageTemplate } from '../about/PageTemplate'
import { Checkbox, Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import {
  Column,
  FormButtonWrapper,
  FormCheckboxWrapper,
  FormInputWrapper,
} from './AuthWrappers'

const LoginPage = () => {
  const { user, error, isLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  return (
    <PageTemplate>
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: '',
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
        <Form>
          <FormInputWrapper>
            <Input type="text" name="email" label="Email" />
            <Input name="password" label="Password" type="password" />
          </FormInputWrapper>
          {error && <ErrorMessage>Invalid Login</ErrorMessage>}

          <FormCheckboxWrapper>
            <LabeledRow
              label={<label htmlFor="rememberMe">Remember Me</label>}
              left={<Checkbox name="rememberMe" />}
            />
          </FormCheckboxWrapper>

          <FormButtonWrapper>
            <Button disabled={isLoading} type="submit">
              {isLoading ? 'Logging in' : 'Login'}
            </Button>
          </FormButtonWrapper>
        </Form>
      </Formik>
      <Column>
        <Link to="/signup">Sign up</Link>
        <Link to="/password/reset">Reset your password</Link>
        <Link to="/confirmation/resend">Resend confirmation instructions</Link>
      </Column>
    </PageTemplate>
  )
}

export default LoginPage
