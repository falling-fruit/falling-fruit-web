import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components/macro'
import * as Yup from 'yup'

import { editProfile } from '../../redux/authSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import {
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from '../auth/AuthWrappers'
import { PasswordInput } from '../form/FormikWrappers'
import { BackButton } from '../ui/ActionButtons'
import Button from '../ui/Button'
import LoadingIndicator from '../ui/LoadingIndicator'
import { Page } from '../ui/PageTemplate'

const formToUser = ({ password, new_password }, user) => ({
  password: new_password || null,
  password_confirmation: password || null,
  email: user.email,
  name: user.name || null,
  bio: user.bio || null,
  range: null,
  announcements_email: user.announcements_email,
})

const StyledBackButton = styled(BackButton)`
  margin-bottom: 23px;
`

const ChangePasswordPage = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const isLoggedIn = !!user
  const { t } = useTranslation()
  const history = useAppHistory()

  if (!isLoggedIn && !isLoading) {
    return <Redirect to={pathWithCurrentView('/auth/sign_in')} />
  }

  const handleSubmit = (values, formikProps) => {
    dispatch(editProfile(formToUser(values, user))).then((action) => {
      if (action.error) {
        formikProps.setSubmitting(false)
      } else {
        history.push('/account/edit')
      }
    })
  }

  return (
    <Page>
      <StyledBackButton backPath="/account/edit" />
      <h1>{t('users.change_password')}</h1>

      {user ? (
        <>
          <Formik
            initialValues={{
              new_password: '',
              new_password_confirm: '',
              password: '',
            }}
            validationSchema={Yup.object({
              new_password: Yup.string().min(6).required(),
              new_password_confirm: Yup.string()
                .oneOf([Yup.ref('new_password')])
                .required(),
              password: Yup.string().required(),
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, dirty, isValid, isSubmitting }) => (
              <Form>
                <FormInputWrapper>
                  <PasswordInput
                    invalidWhenUntouched
                    name="password"
                    label={t('users.current_password')}
                    required
                  />
                  <PasswordInput
                    name="new_password"
                    label={t('users.new_password')}
                    autoComplete="new-password"
                    required
                  />
                  {errors.new_password && (
                    <ErrorMessage>
                      {errors.new_password.key === 'form.error.confirmation' &&
                        t('form.error.confirmation')}
                      {errors.new_password.key === 'form.error.too_short' &&
                        t('form.error.too_short', {
                          min: errors.new_password.options.min,
                        })}
                    </ErrorMessage>
                  )}

                  <PasswordInput
                    name="new_password_confirm"
                    label={t('users.new_password_confirmation')}
                    autoComplete="new-password"
                    required
                  />
                  {errors.new_password_confirm && (
                    <ErrorMessage>
                      {t(
                        errors.new_password_confirm.key,
                        errors.new_password_confirm.options,
                      )}
                    </ErrorMessage>
                  )}
                </FormInputWrapper>
                <FormButtonWrapper>
                  <Button
                    type="submit"
                    disabled={!dirty || !isValid || isSubmitting}
                  >
                    {t('form.button.submit')}
                  </Button>
                </FormButtonWrapper>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </Page>
  )
}

export default ChangePasswordPage
