import { Form, Formik } from 'formik'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { addUser } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { PageScrollWrapper, PageTemplate } from '../about/PageTemplate'
import { Input, Recaptcha, Textarea } from '../form/FormikWrappers'
import Button from '../ui/Button'
import {
  ErrorMessage,
  FormButtonWrapper,
  FormInputWrapper,
} from './AuthWrappers'

const formToUser = (form) => ({ ...form, password_confirm: undefined })

const SignupPage = () => {
  const history = useAppHistory()
  const recaptchaRef = useRef()

  const isLoading = useSelector((state) => state.auth.isLoading)
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const { t } = useTranslation()

  if (!isLoading && isLoggedIn) {
    history.push('/map')
    return
  }

  const handleSubmit = async (values) => {
    const newUser = formToUser(values)

    try {
      await addUser(newUser)
      toast.success(
        `${t('devise.registrations.signed_up')} ${t(
          'devise.confirmations.send_instructions',
        )}`,
        {
          autoClose: 5000,
        },
      )
      history.push('/map')
    } catch (e) {
      toast.error(e.response?.data?.error)
      console.error(e.response)
      recaptchaRef.current.reset()
    }
  }

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <h1>{t('glossary.sign_up')}</h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
            password_confirm: '',
            name: '',
            bio: '',
          }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            password_confirm: Yup.string()
              .oneOf([Yup.ref('password')])
              .required(),
            name: Yup.string(),
            bio: Yup.string(),
            'g-recaptcha-response': Yup.string().required(),
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, dirty, isValid, isSubmitting }) => (
            <Form>
              <FormInputWrapper>
                <Input type="email" name="email" label={t('glossary.email')} />

                <Input
                  type="password"
                  name="password"
                  label={t('glossary.password')}
                />
                {errors.password && (
                  <ErrorMessage>
                    {t(errors.password.key, errors.password.options)}
                  </ErrorMessage>
                )}

                <Input
                  type="password"
                  name="password_confirm"
                  label={t('users.password_confirmation')}
                />
                {errors.password_confirm && (
                  <ErrorMessage>
                    {t(
                      errors.password_confirm.key,
                      errors.password_confirm.options,
                    )}
                  </ErrorMessage>
                )}

                <Input
                  type="text"
                  name="name"
                  label={t('glossary.name')}
                  optional
                />

                <Textarea name="bio" label={t('users.bio')} optional />
              </FormInputWrapper>

              <Recaptcha
                name="g-recaptcha-response"
                ref={(e) => {
                  recaptchaRef.current = e
                }}
              />

              <FormButtonWrapper>
                <Button secondary type="reset">
                  {t('form.button.reset')}
                </Button>
                <Button
                  type="submit"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {t('glossary.sign_up')}
                </Button>
              </FormButtonWrapper>
            </Form>
          )}
        </Formik>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export default SignupPage
