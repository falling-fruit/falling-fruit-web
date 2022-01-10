import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import { Input, Recaptcha } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

export const EmailForm = ({ onSubmit, recaptchaRef }) => (
  <Formik
    initialValues={{
      email: '',
    }}
    validationSchema={Yup.object({
      email: Yup.string().email().required(),
      'g-recaptcha-response': Yup.string().required(),
    })}
    onSubmit={onSubmit}
  >
    {({ dirty, isValid, isSubmitting }) => (
      <Form>
        <FormInputWrapper>
          <Input type="text" name="email" label="Email" />
        </FormInputWrapper>

        <Recaptcha
          name="g-recaptcha-response"
          ref={(e) => {
            recaptchaRef.current = e
          }}
        />

        <FormButtonWrapper>
          <Button disabled={!dirty || !isValid || isSubmitting} type="submit">
            {isSubmitting ? 'Sending' : 'Send'}
          </Button>
        </FormButtonWrapper>
      </Form>
    )}
  </Formik>
)
