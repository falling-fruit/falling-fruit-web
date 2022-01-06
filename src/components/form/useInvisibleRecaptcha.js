import { useRef } from 'react'
import Reaptcha from 'reaptcha'

export const useInvisibleRecaptcha = (handleSubmit) => {
  const recaptchaRef = useRef()
  const submitArgsRef = useRef()

  const handlePresubmit = (values, formikBag) => {
    submitArgsRef.current = { values, formikBag }
    recaptchaRef.current.execute()
  }

  const handleVerify = (recaptchaResponse) => {
    const { values, formikBag } = submitArgsRef.current

    handleSubmit(
      { ...values, 'g-recaptcha-response': recaptchaResponse },
      formikBag,
    )
  }

  const Recaptcha = () => (
    <Reaptcha
      size="invisible"
      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      ref={(e) => {
        recaptchaRef.current = e
      }}
      onVerify={handleVerify}
    />
  )

  return {
    Recaptcha,
    handlePresubmit,
  }
}
