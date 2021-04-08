import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import Button from '../ui/Button'
import { Input, Textarea } from './FormikWrappers'

const SignupForm = () => (
  <Formik
    initialValues={{ firstName: '', lastName: '', email: '' }}
    validationSchema={Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    })}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        setSubmitting(false)
      }, 400)
    }}
  >
    <Form>
      <Input name="firstName" label="First Name" />

      <Input name="lastName" label="Last Name" />

      <Input name="email" label="Email!" />

      <Textarea name="feedback" label="Feedback" />

      <Button type="submit">Submit</Button>
    </Form>
  </Formik>
)

export { SignupForm }
