import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { checkAuth, logout } from '../../redux/authSlice'
import { editUser, getUser } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import { Checkbox, Input, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import LoadingIndicator from '../ui/LoadingIndicator'
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
  const isLoading = useSelector((state) => state.auth.isLoading)
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const history = useAppHistory()
  const { t } = useTranslation()

  const [user, setUser] = useState()

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getUser())
    }
    loadUser()
  }, [])

  if (!isLoading && !isLoggedIn) {
    return <Redirect to={getPathWithMapState('/users/sign_in')} />
  }

  const handleSubmit = async (values) => {
    // Pass range unchanged
    const newUser = formToUser({ ...values, range: user.range })
    const isEmailChanged = newUser.email !== user.email

    let response
    try {
      response = await editUser(newUser)
      if (isEmailChanged && response.unconfirmed_email) {
        toast.success(t('devise.registrations.update_needs_confirmation'))
      } else {
        toast.success(t('devise.registrations.updated'))
      }

      setUser(response)
      dispatch(checkAuth())
    } catch (e) {
      toast.error(e.response?.data?.error)
      console.error(e.response)
    }
  }

  return (
    <PageScrollWrapper>
      <PageTemplate>
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
                    <Input type="text" name="name" label={t('glossary.name')} />

                    <Input
                      type="text"
                      name="email"
                      label={t('glossary.email')}
                      required
                    />

                    <Textarea name="bio" label={t('users.bio')} />
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
                  <FormInputWrapper>
                    <Input
                      name="new_password"
                      type="password"
                      label={t('users.new_password')}
                    />
                    {errors.new_password && (
                      <ErrorMessage>
                        {t(
                          errors.new_password.key,
                          errors.new_password.options,
                        )}
                      </ErrorMessage>
                    )}

                    <Input
                      name="new_password_confirm"
                      type="password"
                      label={t('users.new_password_confirmation')}
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
                      {t('glossary.save_changes')}
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
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default AccountPage
