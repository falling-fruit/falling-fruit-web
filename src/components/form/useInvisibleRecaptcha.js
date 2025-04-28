import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Reaptcha from 'reaptcha'
import styled from 'styled-components/macro'

const HiddenReaptcha = styled(Reaptcha)`
  visibility: hidden;
`

export const useInvisibleRecaptcha = (handleSubmit) => {
  const { i18n } = useTranslation()
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
    <HiddenReaptcha
      size="invisible"
      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      ref={(e) => {
        recaptchaRef.current = e
      }}
      onVerify={handleVerify}
      hl={i18n.language}
    />
  )

  return {
    Recaptcha,
    handlePresubmit,
  }
}
