import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { Input, Recaptcha } from '../form/FormikWrappers'
import Button from '../ui/Button'
import { FormButtonWrapper, FormInputWrapper } from './AuthWrappers'

export const EmailForm = ({ onSubmit, recaptchaRef }) => {
  const { t } = useTranslation()
  return (
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
              {t('glossary.send')}
            </Button>
          </FormButtonWrapper>
        </Form>
      )}
    </Formik>
  )
}
