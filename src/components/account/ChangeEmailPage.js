import { Form, Formik } from 'formik'
import { useState } from 'react'
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
import { Input } from '../form/FormikWrappers'
import { BackButton } from '../ui/ActionButtons'
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

const StyledBackButton = styled(BackButton)`
  margin-bottom: 23px;
`

const ChangeEmailPage = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const isLoggedIn = !!user
  const { t } = useTranslation()
  const history = useAppHistory()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false)

  if (!isLoggedIn && !isLoading) {
    return <Redirect to={pathWithCurrentView('/auth/sign_in')} />
  }

  const handleEmailSubmit = (values, formikProps) => {
    dispatch(editProfile(formToUser(values, user))).then((action) => {
      if (action.error) {
        formikProps.setSubmitting(false)
      } else {
        history.push('/account/edit')
      }
    })
  }

  const handleAnnouncementsToggle = (checked) => {
    setIsUpdatingPreferences(true)
    const updatedUser = {
      email: user.email,
      announcements_email: checked,
      name: user.name || null,
      bio: user.bio || null,
      range: null,
    }
    dispatch(editProfile(updatedUser)).then(() => {
      setIsUpdatingPreferences(false)
    })
  }

  return (
    <Page>
      <StyledBackButton backPath="/account/edit" />
      <h1>{t('users.email_settings')}</h1>

      {user ? (
        <>
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
              }}
            >
              {t('glossary.email')}
            </label>
            <div style={{ padding: '8px 0' }}>{user.email}</div>
          </div>

          <div style={{ height: '3em', marginBottom: '1.5em' }}>
            {isUpdatingPreferences ? (
              <LoadingIndicator />
            ) : (
              <LabeledRow
                label={
                  <label htmlFor="announcements_email_toggle">
                    {t('users.options.announcements_email')}
                  </label>
                }
                left={
                  <input
                    type="checkbox"
                    id="announcements_email_toggle"
                    checked={user.announcements_email}
                    onChange={(e) =>
                      handleAnnouncementsToggle(e.target.checked)
                    }
                  />
                }
              />
            )}
          </div>

          {!showEmailForm ? (
            <div style={{ marginBottom: '1.5em' }}>
              <Button onClick={() => setShowEmailForm(true)}>
                {t('users.change_your_email')}
              </Button>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '1.5em' }}>
                {t('users.change_your_email')}
              </h3>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  announcements_email: user.announcements_email,
                  name: user.name || '',
                }}
                validationSchema={Yup.object({
                  email: Yup.string().email().required(),
                  password: Yup.string().required({
                    key: 'form.error.missing_password',
                  }),
                })}
                onSubmit={handleEmailSubmit}
              >
                {({ errors, isValid, isSubmitting }) => (
                  <Form>
                    <FormInputWrapper>
                      <Input
                        name="email"
                        type="email"
                        label={t('users.new_email')}
                        autoComplete="email"
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
                        autoComplete="current-password"
                      />
                      {errors.password && (
                        <ErrorMessage>
                          {t(errors.password.key, errors.password.options)}
                        </ErrorMessage>
                      )}
                    </FormInputWrapper>
                    <FormButtonWrapper>
                      <Button
                        secondary
                        type="button"
                        onClick={() => setShowEmailForm(false)}
                      >
                        {t('form.button.cancel')}
                      </Button>
                      <Button type="submit" disabled={!isValid || isSubmitting}>
                        {t('form.button.submit')}
                      </Button>
                    </FormButtonWrapper>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </>
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </Page>
  )
}

export default ChangeEmailPage
