import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import * as Yup from 'yup'

import { login } from '../../redux/authSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { Checkbox, Input, PasswordInput } from '../form/FormikWrappers'
import AboutSection from '../mobile/AboutSection'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { AuthPage } from '../ui/PageTemplate'
import AuthLinks from './AuthLinks'
import {
  FormButtonWrapper,
  FormCheckboxWrapper,
  FormInputWrapper,
} from './AuthWrappers'
import { withAuthRedirect } from './withAuthRedirect'

const LoginPage = () => {
  const isDesktop = useIsDesktop()
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
          remember_me: false,
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
          password: Yup.string().required(),
          remember_me: Yup.boolean().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(login(values))
          setSubmitting(false)
        }}
      >
        {({ dirty, isValid }) => (
          <Form>
            <FormInputWrapper>
              <Input
                name="email"
                type="text"
                label={t('glossary.email')}
                autoComplete="off"
              />
              <PasswordInput name="password" label={t('glossary.password')} />
            </FormInputWrapper>

            <FormCheckboxWrapper>
              <LabeledRow
                label={
                  <label htmlFor="remember_me">{t('users.remember_me')}</label>
                }
                left={<Checkbox id="remember_me" />}
              />
            </FormCheckboxWrapper>

            <FormButtonWrapper>
              <Button disabled={!dirty || !isValid || isLoading} type="submit">
                {t('users.sign_in')}
              </Button>
            </FormButtonWrapper>
          </Form>
        )}
      </Formik>
      <AuthLinks exclude={['signIn']} />
      {!isDesktop && (
        <>
          {' '}
          <br /> <AboutSection />{' '}
        </>
      )}
    </AuthPage>
  )
}

export default withAuthRedirect(LoginPage, false)
