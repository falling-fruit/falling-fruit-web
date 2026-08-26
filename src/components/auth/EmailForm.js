import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { Input, Recaptcha } from '../form/FormikWrappers'
import FormButtons from '../ui/FormButtons'
import SubmitButton from '../ui/SubmitButton'

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
          <div>
            <Input
              type="text"
              name="email"
              label={t('glossary.email')}
              autoComplete="off"
              required
            />
          </div>

          <Recaptcha
            name="g-recaptcha-response"
            widthMargin={28}
            ref={(e) => {
              recaptchaRef.current = e
            }}
          />

          <FormButtons>
            <SubmitButton
              isSubmitting={isSubmitting}
              disabled={!dirty || !isValid}
              label={t('users.send')}
            />
          </FormButtons>
        </Form>
      )}
    </Formik>
  )
}
