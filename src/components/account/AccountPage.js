import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import * as Yup from 'yup'

import { editProfile, logout } from '../../redux/authSlice'
import { pathWithCurrentView } from '../../utils/appUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { FormButtonWrapper, FormInputWrapper } from '../auth/AuthWrappers'
import { Input, Textarea } from '../form/FormikWrappers'
import AboutSection from '../mobile/AboutSection'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import Column from '../ui/LinkColumn'
import LoadingIndicator from '../ui/LoadingIndicator'
import { TopSafeAreaInsetPage } from '../ui/PageTemplate'

const EmailLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`

const EmailDisplay = styled.div`
  margin-bottom: 1.5em;
`

const PreferencesContainer = styled.div`
  margin-bottom: 1.5em;
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$isDisabled ? 'none' : 'auto')};
`

const LinksContainer = styled.div`
  margin-bottom: 1.5em;
`

const PrivateNotice = styled.div`
  margin-bottom: 1.5em;
  padding: 1em;
  background: ${({ theme }) => theme.secondaryBackground ?? '#f5f5f5'};
  border-radius: 4px;
  line-height: 1.6;

  p {
    margin-bottom: 0.75em;
  }
`

const ProfileFormContainer = styled.div`
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  transition: opacity 0.2s ease;
`

const formToUser = ({ email, name, bio, announcements_email, range }) => ({
  email,
  name: name || null,
  bio: bio || null,
  announcements_email: announcements_email,
  range: range,
})

const userToForm = (user) => ({
  ...user,
  name: user.name ?? '',
  bio: user.bio ?? '',
  announcements_email: user.announcements_email,
})

const AccountPage = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const isLoggedIn = !!user
  const history = useAppHistory()
  const { t } = useTranslation()
  const isDesktop = useIsDesktop()
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false)
  const [isUnhiding, setIsUnhiding] = useState(false)

  if (!isLoggedIn && !isLoading) {
    return <Redirect to={pathWithCurrentView('/auth/sign_in')} />
  }

  const handleSubmit = (values) => {
    dispatch(editProfile(formToUser(values)))
  }

  const handleAnnouncementsToggle = (checked) => {
    if (!user) {
      return
    }
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

  const handleUnhideProfile = () => {
    setIsUnhiding(true)
    dispatch(editProfile({ private: false })).then(() => {
      setIsUnhiding(false)
    })
  }

  const isPrivate = !user?.private

  return (
    <TopSafeAreaInsetPage>
      <h1>{t('glossary.account')}</h1>

      {user ? (
        <>
          <section>
            <EmailLabel>{t('glossary.email')}</EmailLabel>
            <EmailDisplay>{user.email}</EmailDisplay>
            <PreferencesContainer $isDisabled={isUpdatingPreferences}>
              <LabeledRow
                label={
                  <label htmlFor="announcements_email_toggle">
                    {t('users.options.announcements_email')}
                  </label>
                }
                left={
                  <Checkbox
                    type="checkbox"
                    id="announcements_email_toggle"
                    checked={user.announcements_email}
                    disabled={isUpdatingPreferences}
                    onChange={(e) =>
                      handleAnnouncementsToggle(e.target.checked)
                    }
                  />
                }
              />
            </PreferencesContainer>
            <Button
              onClick={() => {
                dispatch(logout())
                history.push('/map')
              }}
            >
              {t('users.sign_out')}
            </Button>
            <LinksContainer>
              <Column>
                <Link to="/account/change-email">
                  {t('users.change_email')}
                </Link>
                <Link to="/account/change-password">
                  {t('users.change_password')}
                </Link>
                <Link to={`/users/${user.id}/activity`}>
                  {t('users.your_activity')}
                </Link>
                {!isPrivate && (
                  <Link to="/account/hide-profile">
                    {t('users.hide_profile')}
                  </Link>
                )}
              </Column>
            </LinksContainer>
          </section>

          <section>
            <h2>{t('users.header.profile')}</h2>
            {isPrivate && (
              <PrivateNotice>
                <p>
                  Your profile is currently hidden. Other users cannot see your
                  name, bio, or profile page. Your contributions remain on the
                  map anonymously.
                </p>
                <Button
                  type="button"
                  onClick={handleUnhideProfile}
                  disabled={isUnhiding}
                >
                  {isUnhiding
                    ? t('form.button.submitting')
                    : 'Unhide my profile'}
                </Button>
              </PrivateNotice>
            )}
            <ProfileFormContainer $isDisabled={isPrivate}>
              <Formik
                enableReinitialize
                initialValues={userToForm(user)}
                validationSchema={Yup.object({
                  name: Yup.string(),
                  bio: Yup.string(),
                })}
                onSubmit={handleSubmit}
              >
                {({ dirty, isValid, isSubmitting }) => (
                  <Form>
                    <FormInputWrapper>
                      <Input
                        type="text"
                        name="name"
                        label={t('glossary.name')}
                        disabled={isPrivate}
                      />
                      <Textarea
                        name="bio"
                        label={t('users.bio')}
                        disabled={isPrivate}
                      />
                    </FormInputWrapper>

                    <FormButtonWrapper>
                      <Button secondary type="reset" disabled={isPrivate}>
                        {t('form.button.reset')}
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          isPrivate || !dirty || !isValid || isSubmitting
                        }
                      >
                        {isSubmitting
                          ? t('form.button.submitting')
                          : t('users.save_changes')}
                      </Button>
                    </FormButtonWrapper>
                  </Form>
                )}
              </Formik>
            </ProfileFormContainer>
          </section>
          {!isDesktop && (
            <section>
              <AboutSection />
            </section>
          )}
        </>
      ) : (
        <LoadingIndicator vertical cover />
      )}
    </TopSafeAreaInsetPage>
  )
}

export default AccountPage
