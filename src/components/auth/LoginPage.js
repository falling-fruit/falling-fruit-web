import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect, useLocation } from 'react-router-dom'
import * as Yup from 'yup'

import { login } from '../../redux/authSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
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
  const { state, search } = useLocation()
  const { t } = useTranslation()
  const params = new URLSearchParams(search)
  const fromPage = params.get('fromPage')

  const dispatch = useDispatch()

  if (!isLoading && user) {
    return <Redirect to={fromPage || pathWithCurrentView('/map')} />
  }

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <h1>{t('users.sign_in')}</h1>
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
              .unwrap()
              .catch((error) => {
                // Here, set the error message based on the error received
                setStatus(
                  'general',
                  `Sign in failed: ${
                    error.message || 'Unexpected error occurred'
                  }`,
                )
              })
              .finally(() => {
                setSubmitting(false)
              })
            setSubmitting(false)
          }}
        >
          {({ dirty, isValid }) => (
            <Form>
              <FormInputWrapper>
                <Input name="email" type="text" label={t('glossary.email')} />
                <Input
                  name="password"
                  type="password"
                  label={t('glossary.password')}
                />
              </FormInputWrapper>
              {dirty && error && (
                <ErrorMessage>{error.response.data.error}</ErrorMessage>
              )}

              <FormCheckboxWrapper>
                <LabeledRow
                  label={
                    <label htmlFor="rememberMe">{t('users.remember_me')}</label>
                  }
                  left={<Checkbox name="rememberMe" />}
                />
              </FormCheckboxWrapper>

              <FormButtonWrapper>
                <Button
                  disabled={!dirty || !isValid || isLoading}
                  type="submit"
                >
                  {t('glossary.login')}
                </Button>
              </FormButtonWrapper>
            </Form>
          )}
        </Formik>
        <Column>
          <Link to="/users/sign_up">{t('glossary.sign_up')}</Link>
          <Link to="/users/password/new">{t('users.forgot_password')}</Link>
          <Link to="/users/confirmation/new">
            {t('users.resend_confirmation_instructions')}
          </Link>
        </Column>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default LoginPage
