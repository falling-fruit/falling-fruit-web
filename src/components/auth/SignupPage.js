import { Form, Formik } from 'formik'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as Yup from 'yup'

import { getPathWithMapState } from '../../utils/getInitialUrl'
import { PageTemplate } from '../about/PageTemplate'
import { Input, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

const SignupPage = () => {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (!isLoading && user) {
    return <Redirect to={getPathWithMapState('/map')} />
  }

  // TODO: add recaptcha here

  return (
    <PageTemplate>
      <h1>Sign up</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          passwordConfirmation: '',
          textArea: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(),
          email: Yup.string().email().required(),
          password: Yup.string().required(),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Passwords must match',
          ),
          textArea: Yup.string().optional(),
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
            <Input name="name" label="Name" />

            <Input name="email" label="Email" />

            <Input name="password" label="Password" type="password" />
            <Input
              name="passwordConfirmation"
              label="Confirm Password"
              type="password"
            />

            <Textarea name="description" label="About You " optional />
          </FormInputWrapper>

          <FormButtonWrapper>
            <Button type="submit">Sign up</Button>
          </FormButtonWrapper>
        </Form>
      </Formik>
    </PageTemplate>
  )
}

export default SignupPage
