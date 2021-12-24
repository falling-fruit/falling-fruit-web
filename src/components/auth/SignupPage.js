import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import { PageTemplate } from '../about/PageTemplate'
import { Checkbox, Input, Recaptcha, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import LabeledRow from '../ui/LabeledRow'
import { FormCheckboxWrapper, FormInputWrapper } from './AuthWrappers'

const SignupPage = () => (
  <PageTemplate>
    <h1>Signup</h1>
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        textArea: '',
        editAnonymously: false,
        mailingList: true,
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
        editAnonymously: Yup.boolean().required(),
        mailingList: Yup.boolean().required(),
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
        <FormCheckboxWrapper>
          <LabeledRow
            label={
              <label htmlFor="editAnonymously">
                Edit the map anonymously (even while logged in)
              </label>
            }
            left={<Checkbox name="editAnonymously" id="editAnonymously" />}
          />

          <LabeledRow
            label={
              <label htmlFor="mailingList">
                Receive emails with important announcements and opportunities
                (1-2 per year)
              </label>
            }
            left={<Checkbox name="mailingList" id="mailingList" />}
          />
        </FormCheckboxWrapper>

        <Recaptcha />
        <Button type="submit">Signup</Button>
      </Form>
    </Formik>
  </PageTemplate>
)

export default SignupPage
