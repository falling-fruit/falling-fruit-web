import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as Yup from 'yup'

import { editProfile } from '../../redux/authSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import {
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from '../auth/AuthWrappers'
import { Checkbox, Input } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import LoadingIndicator from '../ui/LoadingIndicator'
import { Page } from '../ui/PageTemplate'

const formToUser = ({ email, password, announcements_email, name }, user) => ({
  email,
  password_confirmation: password,
  announcements_email,
  name: name || null,
  bio: user.bio || null,
  range: null,
})

const ChangeEmailPage = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const isLoggedIn = !!user
  const { t } = useTranslation()
  const history = useAppHistory()

  if (!isLoggedIn && !isLoading) {
    return <Redirect to={pathWithCurrentView('/users/sign_in')} />
  }

  const handleSubmit = (values, formikProps) => {
    dispatch(editProfile(formToUser(values, user))).then((action) => {
      if (action.error) {
        formikProps.setSubmitting(false)
      } else {
        history.push('/users/edit')
      }
    })
  }

  return (
    <Page>
      <h1>{t('users.email_settings')}</h1>

      {user ? (
        <>
          <Formik
            initialValues={{
              email: user.email,
              password: '',
              announcements_email: user.announcements_email,
              name: user.name || '',
            }}
            validationSchema={Yup.object({
              email: Yup.string().email().required(),
              password: Yup.string().when('email', {
                is: (email) => email !== user.email,
                then: (schema) =>
                  schema.required({
                    key: 'form.error.missing_password',
                  }),
                otherwise: (schema) => schema,
              }),
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, values, initialValues, isValid, isSubmitting }) => {
              // Only consider the form dirty if email or announcements_email have changed
              const isDirty =
                values.email !== initialValues.email ||
                values.announcements_email !== initialValues.announcements_email

              return (
                <Form>
                  <FormInputWrapper>
                    <Input
                      name="email"
                      type="email"
                      label={t('glossary.email')}
                      autocomplete="email"
                    />
                    {errors.email && (
                      <ErrorMessage>
                        {t(errors.email.key, errors.email.options)}
                      </ErrorMessage>
                    )}

                    <Input
                      name="password"
                      type="password"
                      label={t('glossary.password')}
                      autocomplete="current-password"
                    />
                    {errors.password && (
                      <ErrorMessage>
                        {t(errors.password.key, errors.password.options)}
                      </ErrorMessage>
                    )}
                  </FormInputWrapper>
                  <LabeledRow
                    label={
                      <label htmlFor="announcements_email">
                        {t('users.options.announcements_email')}
                      </label>
                    }
                    left={<Checkbox name="announcements_email" />}
                    style={{ margin: '16px 0 8px 0' }}
                  />
                  <FormButtonWrapper>
                    <Button
                      secondary
                      type="button"
                      onClick={() => history.push('/users/edit')}
                    >
                      {t('form.button.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isDirty || !isValid || isSubmitting}
                    >
                      {t('form.button.submit')}
                    </Button>
                  </FormButtonWrapper>
                </Form>
              )
            }}
          </Formik>
        </>
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </Page>
  )
}

export default ChangeEmailPage
