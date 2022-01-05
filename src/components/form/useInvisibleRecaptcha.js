import { useRef } from 'react'

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

  return {
    setRecaptchaRef: (e) => {
      recaptchaRef.current = e
    },
    handlePresubmit,
    handleVerify,
  }
}
