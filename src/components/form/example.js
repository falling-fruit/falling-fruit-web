import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

import Button from '../ui/Button'
import Input from '../ui/Input'
import Label from '../ui/Label'

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
      <Label htmlFor="firstName">First Name</Label>
      <Field name="firstName" type="text" as={Input} />
      <ErrorMessage name="firstName" />

      <Label htmlFor="lastName">Last Name</Label>
      <Field name="lastName" type="text" as={Input} />
      <ErrorMessage name="lastName" />

      <Label htmlFor="email">Email Address</Label>
      <Field name="email" type="email" as={Input} />
      <ErrorMessage name="email" />

      <Button type="submit">Submit</Button>
    </Form>
  </Formik>
)

export { SignupForm }
