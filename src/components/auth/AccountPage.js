import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as Yup from 'yup'

import { editProfile, logout } from '../../redux/authSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { Checkbox, Input, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import LoadingIndicator from '../ui/LoadingIndicator'
import { Page } from '../ui/PageTemplate'
import {
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from './AuthWrappers'

const formToUser = ({
  email,
  name,
  bio,
  new_password,
  password_confirmation,
  announcements_email,
  range,
}) => ({
  email,
  name: name || null,
  bio: bio || null,
  password: new_password || null,
  password_confirmation: password_confirmation || null,
  announcements_email: announcements_email,
  range: range,
})

const userToForm = (user) => ({
  ...user,
  name: user.name ?? '',
  bio: user.bio ?? '',
  new_password: '',
  new_password_confirm: '',
  password_confirmation: '',
  announcements_email: user.announcements_email,
})

const AccountPage = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const isLoggedIn = !!user
  const history = useAppHistory()
  const { t } = useTranslation()

  if (!isLoggedIn && !isLoading) {
    return <Redirect to={pathWithCurrentView('/users/sign_in')} />
  }

  const handleSubmit = (values) => {
    dispatch(editProfile(formToUser(values)))
  }

  return (
    <Page>
      <h1>{t('users.edit_account')}</h1>

      {user ? (
        <>
          <Formik
            enableReinitialize
            initialValues={userToForm(user)}
            validationSchema={Yup.object({
              name: Yup.string(),
              email: Yup.string().email().required(),
              bio: Yup.string(),
              new_password: Yup.string().min(6),
              new_password_confirm: Yup.string()
                .oneOf([Yup.ref('new_password')])
                .when('new_password', (new_password, schema) =>
                  new_password ? schema.required() : schema,
                ),
              password: Yup.string().when(
                ['new_password', 'email'],
                (new_password, email, schema) =>
                  new_password || email !== user.email
                    ? schema.required({ key: 'form.error.missing_password' })
                    : schema,
              ),
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, dirty, isValid, isSubmitting }) => (
              <Form>
                <FormInputWrapper>
                  <Input
                    type="text"
                    name="name"
                    label={t('glossary.name')}
                    autoComplete="off"
                  />

                  <Input
                    type="text"
                    name="email"
                    label={t('glossary.email')}
                    required
                    autoComplete="email"
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
                  style={{ marginBlock: '16px 8px' }}
                />
                <FormInputWrapper>
                  <Input
                    name="new_password"
                    type="password"
                    label={t('users.new_password')}
                    autoComplete="new-password"
                  />
                  {errors.new_password && (
                    <ErrorMessage>
                      {errors.new_password.key === 'form.error.confirmation' &&
                        t('form.error.confirmation')}
                      {errors.new_password.key === 'form.error.too_short' &&
                        t('form.error.too_short', {
                          min: errors.new_password.options.min,
                        })}
                      {errors.new_password.key ===
                        'form.error.missing_password' &&
                        t('form.error.missing_password')}
                    </ErrorMessage>
                  )}

                  <Input
                    name="new_password_confirm"
                    type="password"
                    label={t('users.new_password_confirmation')}
                    autoComplete="new-password"
                  />
                  {errors.new_password_confirm && (
                    <ErrorMessage>
                      {t(
                        errors.new_password_confirm.key,
                        errors.new_password_confirm.options,
                      )}
                    </ErrorMessage>
                  )}

                  <Input
                    invalidWhenUntouched
                    name="password"
                    type="password"
                    label={t('users.current_password')}
                  />
                  {errors.password && (
                    <ErrorMessage>
                      {t(errors.password.key, errors.password.options)}
                    </ErrorMessage>
                  )}
                </FormInputWrapper>
                <FormButtonWrapper>
                  <Button secondary type="reset">
                    {t('form.button.reset')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!dirty || !isValid || isSubmitting}
                  >
                    {t('users.save_changes')}
                  </Button>
                </FormButtonWrapper>
                {/* TODO: allow user to delete account. Need design */}
              </Form>
            )}
          </Formik>
          <br />
          <Button
            onClick={() => {
              dispatch(logout())
              history.push('/map')
            }}
          >
            {t('glossary.logout')}
          </Button>
        </>
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </Page>
  )
}

export default AccountPage
