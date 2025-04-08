import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import * as Yup from 'yup'

import { login } from '../../redux/authSlice'
import { Checkbox, Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { AuthPage } from '../ui/PageTemplate'
import {
  Column,
  FormButtonWrapper,
  FormCheckboxWrapper,
  FormInputWrapper,
} from './AuthWrappers'
import { withAuthRedirect } from './withAuthRedirect'

const LoginPage = () => {
  const { isLoading } = useSelector((state) => state.auth)
  const { state } = useLocation()
  const { t } = useTranslation()

  const dispatch = useDispatch()

  return (
    <AuthPage>
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

            <FormCheckboxWrapper>
              <LabeledRow
                label={
                  <label htmlFor="rememberMe">{t('users.remember_me')}</label>
                }
                left={<Checkbox name="rememberMe" />}
              />
            </FormCheckboxWrapper>

            <FormButtonWrapper>
              <Button disabled={!dirty || !isValid || isLoading} type="submit">
                {t('users.login')}
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
    </AuthPage>
  )
}

export default withAuthRedirect(LoginPage, false)
