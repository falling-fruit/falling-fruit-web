import { Form, Formik } from 'formik'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as Yup from 'yup'

import { getPathWithMapState } from '../../utils/getInitialUrl'
import { PageTemplate } from '../about/PageTemplate'
import { Input, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const AccountPage = () => {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && !user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  return (
    <PageTemplate>
      <h1>Edit Account</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          newPassword: '',
          newPasswordConfirmation: '',
          textArea: '',
          currentPassword: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string(),
          email: Yup.string().email(),
          newPassword: Yup.string(),
          newPasswordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Passwords must match',
          ),
          textArea: Yup.string().optional(),
          currentPassword: Yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
      >
        <Form>
          <FormInputWrapper>
            <Input type="text" name="name" label="Name" />

            <Input type="text" name="email" label="Email" />

            <Textarea name="description" label="About You " optional />

            <Input name="newPassword" label="New Password" type="password" />
            <Input
              name="newPasswordConfirmation"
              label="Confirm New Password"
              type="password"
            />

            <Input
              name="currentPassword"
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
    </PageTemplate>
  )
}

export default AccountPage
