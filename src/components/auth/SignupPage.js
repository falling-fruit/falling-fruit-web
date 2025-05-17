import { Form, Formik } from 'formik'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { addUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { Checkbox, Input, Recaptcha, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { AuthPage } from '../ui/PageTemplate'
import {
  Column,
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from './AuthWrappers'
import { withAuthRedirect } from './withAuthRedirect'

const formToUser = (form) => ({ ...form, password_confirm: undefined })

const SignupPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()
  const { t } = useTranslation()

  const handleSubmit = async (values) => {
    const newUser = formToUser(values)

    try {
      await addUser(newUser)
      toast.success(
        `${t('devise.registrations.signed_up')} ${t(
          'devise.confirmations.send_instructions',
        )}`,
        {
          autoClose: 5000,
        },
      )
      history.push('/map')
    } catch (error) {
      toast.error(
        t('error_message.auth.signup_failed', {
          message: error.message || t('error_message.unknown_error'),
        }),
      )
      recaptchaRef.current.reset()
    }
  }

  return (
    <AuthPage>
      <h1>{t('glossary.sign_up')}</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
          password_confirm: '',
          name: '',
          bio: '',
          announcements_email: true,
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required(),
          password: Yup.string().min(6).required(),
          password_confirm: Yup.string()
            .oneOf([Yup.ref('password')])
            .required(),
          name: Yup.string(),
          bio: Yup.string(),
          'g-recaptcha-response': Yup.string().required(),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, dirty, isValid, isSubmitting }) => (
          <Form>
            <FormInputWrapper>
              <Input
                type="email"
                name="email"
                label={t('glossary.email')}
                required
                autoComplete="off"
              />

              <Input
                type="password"
                name="password"
                label={t('glossary.password')}
                required
              />
              {errors.password && (
                <ErrorMessage>
                  {t(errors.password.key, errors.password.options)}
                </ErrorMessage>
              )}

              <Input
                type="password"
                name="password_confirm"
                label={t('users.password_confirmation')}
                required
              />
              {errors.password_confirm && (
                <ErrorMessage>
                  {t(
                    errors.password_confirm.key,
                    errors.password_confirm.options,
                  )}
                </ErrorMessage>
              )}

              <Input
                type="text"
                name="name"
                label={t('glossary.name')}
                autoComplete="off"
              />

              <Textarea name="bio" label={t('users.bio')} />
            </FormInputWrapper>
            <LabeledRow
              label={
                <label htmlFor="announcements_email">
                  {t('users.options.announcements_email')}
                </label>
              }
              left={<Checkbox id="announcements_email" />}
              style={{ margin: '16px 0' }}
            />

            <Recaptcha
              name="g-recaptcha-response"
              ref={(e) => {
                recaptchaRef.current = e
              }}
            />

            <FormButtonWrapper>
              <Button secondary type="reset">
                {t('form.button.reset')}
              </Button>
              <Button
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {t('glossary.sign_up')}
              </Button>
            </FormButtonWrapper>
          </Form>
        )}
      </Formik>
      <Column>
        <Link to="/users/sign_in">{t('users.sign_in')}</Link>
        <Link to="/users/password/new">{t('users.forgot_password')}</Link>
        <Link to="/users/confirmation/new">
          {t('users.resend_confirmation_instructions')}
        </Link>
      </Column>
    </AuthPage>
  )
}

export default withAuthRedirect(SignupPage)
