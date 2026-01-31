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
import { Input, PasswordInput } from '../form/FormikWrappers'
import { BackButton } from '../ui/ActionButtons'
import Button from '../ui/Button'
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

  const validationSchema = Yup.object({
    email: Yup.string()
      .email()
      .required()
      .test(
        'is-different',
        t('form.error.must_be_different'),
        function (value) {
          return value !== user?.email
        },
      ),
    password: Yup.string().required(),
  })

  return (
    <Page>
      <StyledBackButton backPath="/account/edit" />
      <h1>{t('users.change_email')}</h1>

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
              {t('users.current_email')}
            </label>
            <div style={{ padding: '8px 0' }}>{user.email}</div>
          </div>

          <Formik
            initialValues={{
              email: '',
              password: '',
              announcements_email: user.announcements_email,
              name: user.name || '',
            }}
            validationSchema={validationSchema}
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
                    required
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  <PasswordInput
                    name="password"
                    label={t('glossary.password')}
                    autoComplete="current-password"
                    required
                  />
                </FormInputWrapper>
                <FormButtonWrapper>
                  <Button type="submit" disabled={!isValid || isSubmitting}>
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

export default ChangeEmailPage
