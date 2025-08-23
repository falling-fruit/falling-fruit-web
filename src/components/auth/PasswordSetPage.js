import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { resetPassword } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import Column from '../ui/LinkColumn'
import { AuthPage } from '../ui/PageTemplate'
import {
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from './AuthWrappers'
import SignInLink from './SignInLink'
import { withAuthRedirect } from './withAuthRedirect'

const getResetToken = () =>
  new URLSearchParams(window.location.search).get('token')

const PasswordSetPage = () => {
  const history = useAppHistory()
  const { t } = useTranslation()

  useEffect(() => {
    if (!getResetToken()) {
      toast.error(t('devise.passwords.no_token'), { autoClose: 5000 })
      history.push('/auth/sign_in')
    }
  }, [history, t])

  const handleSubmit = async ({ password }) => {
    try {
      const { email } = await resetPassword({
        password: password,
        token: getResetToken(),
      })
      toast.success(t('devise.passwords.updated_not_active'), {
        autoClose: 5000,
      })
      history.push({ pathname: '/auth/sign_in', state: { email } })
    } catch (error) {
      toast.error(
        t('error_message.auth.password_set_failed', {
          message: error.message || t('error_message.unknown_error'),
        }),
      )
      history.push('/auth/sign_in')
    }
  }

  return (
    <AuthPage>
      <h1>{t('users.change_your_password')}</h1>
      <Formik
        initialValues={{
          password: '',
          password_confirm: '',
        }}
        validationSchema={Yup.object({
          password: Yup.string().min(6).required(),
          password_confirm: Yup.string()
            .oneOf([Yup.ref('password')])
            .required(),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, dirty, isValid, isSubmitting }) => (
          <Form>
            <FormInputWrapper>
              <Input
                type="password"
                name="password"
                label={t('users.new_password')}
              />
              {errors.password && (
                <ErrorMessage>
                  {t(errors.password.key, errors.password.options)}
                </ErrorMessage>
              )}

              <Input
                type="password"
                name="password_confirm"
                label={t('users.new_password_confirmation')}
              />
              {errors.password_confirm && (
                <ErrorMessage>
                  {t(
                    errors.password_confirm.key,
                    errors.password_confirm.options,
                  )}
                </ErrorMessage>
              )}
            </FormInputWrapper>

            <FormButtonWrapper>
              <Button
                disabled={!dirty || !isValid || isSubmitting}
                type="submit"
              >
                {t('users.change_your_password')}
              </Button>
            </FormButtonWrapper>
          </Form>
        )}
      </Formik>
      <Column>
        <SignInLink />
      </Column>
    </AuthPage>
  )
}

export default withAuthRedirect(PasswordSetPage)
