import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { checkAuth, logout } from '../../redux/authSlice'
import { editUser, getUser } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import { Input, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LoadingIndicator from '../ui/LoadingIndicator'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const formToUser = ({
  email,
  name,
  bio,
  new_password,
  password_confirmation,
}) => ({
  email,
  name: name || null,
  bio: bio || null,
  password: new_password || null,
  range: null,
  password_confirmation,
})

const userToForm = (user) => ({
  ...user,
  name: user.name ?? '',
  bio: user.bio ?? '',
  new_password: '',
  new_password_confirm: '',
  password_confirmation: '',
})

const AccountPage = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.auth.isLoading)
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const history = useAppHistory()

  const [user, setUser] = useState()

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getUser())
    }
    loadUser()
  }, [])

  if (!isLoading && !isLoggedIn) {
    return <Redirect to={getPathWithMapState('/login')} />
  }

  const handleSubmit = async (values) => {
    const newUser = formToUser(values)
    const isEmailChanged = newUser.email !== user.email

    let response
    try {
      response = await editUser(newUser)

      const details =
        isEmailChanged && response.unconfirmed_email
          ? ` A confirmation email was sent to ${response.unconfirmed_email}.`
          : ''
      toast.success(`Account edited successfully!${details}`)

      setUser(response)
      dispatch(checkAuth())
    } catch (e) {
      toast.error(`Account editing failed: ${e.response?.data?.error}`)
      console.error(e.response)
    }
  }

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <h1>Edit account</h1>
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
                new_password_confirm: Yup.string().test(
                  'passwords-match',
                  'Passwords must match',
                  function (value) {
                    return this.parent.new_password === value
                  },
                ),
                password_confirmation: Yup.string()
                  .when('new_password', (new_password, schema) =>
                    new_password
                      ? schema.required(
                          'Old password required when changing password',
                        )
                      : schema,
                  )
                  .when('email', (email, schema) =>
                    email !== user.email
                      ? schema.required(
                          'Old password required when changing email',
                        )
                      : schema,
                  ),
              })}
              onSubmit={handleSubmit}
            >
              {({ dirty, isValid, isSubmitting }) => (
                <Form>
                  <FormInputWrapper>
                    <Input type="text" name="name" label="Name" optional />

                    <Input type="text" name="email" label="Email" />

                    <Textarea name="bio" label="About you" optional />

                    <p>Password must be at least 6 characters long.</p>

                    <Input
                      name="new_password"
                      label="New password"
                      type="password"
                    />
                    <Input
                      name="new_password_confirm"
                      label="Confirm new password"
                      type="password"
                    />

                    <p>
                      Current password is required to change email or password.
                    </p>
                    {/* TODO: need designs for this information */}

                    <Input
                      invalidWhenUntouched
                      name="password_confirmation"
                      label="Current password"
                      type="password"
                    />
                  </FormInputWrapper>
                  <FormButtonWrapper>
                    <Button secondary type="reset">
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      disabled={!dirty || !isValid || isSubmitting}
                    >
                      {isSubmitting ? 'Saving changes' : 'Save changes'}
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
              Logout
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
