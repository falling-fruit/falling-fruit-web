import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components/macro'
import * as Yup from 'yup'

import { login } from '../../redux/authSlice'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { PageTemplate } from '../about/PageTemplate'
import { Checkbox, Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import {
  FormButtonWrapper,
  FormCheckboxWrapper,
  FormInputWrapper,
} from './AuthWrappers'

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.invalid} !important;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
`

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
            <Button type="submit">Login</Button>
          </FormButtonWrapper>
        </Form>
      </Formik>
      <Column>
        <Link to="/signup">Signup</Link>
        <a href="reset">Reset your password</a>
        <a href="resend">Resend confirmation instructions</a>
      </Column>
    </PageTemplate>
  )
}

export default LoginPage
