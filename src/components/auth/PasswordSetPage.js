import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { resetPassword } from '../../utils/api'
import { pathWithCurrentView, withFromPage } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageTemplate } from '../about/PageTemplate'
import { Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import {
  Column,
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from './AuthWrappers'

const getResetToken = () =>
  new URLSearchParams(window.location.search).get('token')

const PasswordSetPage = () => {
  const history = useAppHistory()
  const { user, isLoading } = useSelector((state) => state.auth)
  const { t } = useTranslation()

  useEffect(() => {
    if (!getResetToken()) {
      toast.error(t('devise.passwords.no_token'), { autoClose: 5000 })
      history.push('/users/sign_in')
    }
  }, [history, t])

  if (!isLoading && user) {
    return <Redirect to={pathWithCurrentView('/map')} />
  }

  const handleSubmit = async ({ password }) => {
    try {
      const { email } = await resetPassword({
        password: password,
        token: getResetToken(),
      })
      toast.success(t('devise.passwords.updated_not_active'), {
        autoClose: 5000,
      })
      history.push({ pathname: '/users/sign_in', state: { email } })
    } catch (error) {
      toast.error(
        `Setting new password failed: ${error.message || 'Unknown error'}`,
      )
      history.push('/users/sign_in')
    }
  }

  return (
    <PageTemplate>
      <h1>{t('users.change_password')}</h1>
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
                {t('users.change_password')}
              </Button>
            </FormButtonWrapper>
          </Form>
        )}
      </Formik>
      <Column>
        <Link to={withFromPage('/users/sign_in')}>{t('users.sign_in')}</Link>
      </Column>
    </PageTemplate>
  )
}

export default PasswordSetPage
