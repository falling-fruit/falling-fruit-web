import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { editUser, getUser } from '../../utils/api'
import { getPathWithMapState } from '../../utils/getInitialUrl'
import { PageTemplate } from '../about/PageTemplate'
import { Input, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const formToUser = ({ bio, new_password, password_confirmation }) => ({
  bio: bio || null,
  password: new_password || null,
  password_confirmation,
})

const userToForm = (user) => ({
  ...user,
  bio: user.bio ?? '',
  new_password: '',
  new_password_confirm: '',
  password_confirmation: '',
})

const AccountPage = () => {
  const isLoading = useSelector((state) => state.auth.isLoading)
  const isLoggedIn = useSelector((state) => !!state.auth.user)

  const [user, setUser] = useState()

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getUser())
    }
    loadUser()
  }, [])

  if (!isLoading && !isLoggedIn) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  const handleSubmit = async (values) => {
    let response
    try {
      response = await editUser(formToUser(values))
      toast.success('Account edited successfully!')
    } catch {
      toast.error('Account editing failed.')
      console.error(response)
    }
  }

  return (
    <PageTemplate>
      <h1>Edit Account</h1>
      {user && (
        <Formik
          initialValues={userToForm(user)}
          validationSchema={Yup.object({
            name: Yup.string(),
            email: Yup.string().email(),
            bio: Yup.string(),
            new_password: Yup.string(),
            new_password_confirm: Yup.string().oneOf(
              [Yup.ref('new_password'), null],
              'Passwords must match',
            ),
            password_confirmation: Yup.string().required(),
          })}
          onSubmit={handleSubmit}
        >
          <Form>
            <FormInputWrapper>
              <Input type="text" name="name" label="Name" />

              <Input type="text" name="email" label="Email" />

              <Textarea name="bio" label="About You" optional />

              <Input name="new_password" label="New Password" type="password" />
              <Input
                name="new_password_confirm"
                label="Confirm New Password"
                type="password"
              />

              <Input
                name="password_confirmation"
                label="Current Password"
                type="password"
              />
            </FormInputWrapper>
            <FormButtonWrapper>
              <Button secondary type="reset">
                Clear
              </Button>
              <Button type="submit">Save</Button>
            </FormButtonWrapper>
          </Form>
        </Formik>
      )}
    </PageTemplate>
  )
}

export default AccountPage
