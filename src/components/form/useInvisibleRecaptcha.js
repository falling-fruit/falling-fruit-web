import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Reaptcha from 'reaptcha'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
import useShareUrl from '../share/useShareUrl'

const HiddenReaptcha = styled(Reaptcha)`
  visibility: hidden;
`

export const useInvisibleRecaptcha = (handleSubmit, formValuesKey) => {
  const { i18n, t } = useTranslation()
  const history = useAppHistory()
  const recaptchaRef = useRef()
  const submitArgsRef = useRef()
  const shareUrl = useShareUrl()

  const handlePresubmit = async (values, formikBag) => {
    if (!navigator.onLine) {
      toast.warning(t('error_message.connectivity.you_are_offline'))
      formikBag.setSubmitting(false)
      return
    }

    submitArgsRef.current = { values, formikBag }
    await recaptchaRef.current.execute()
  }

  const handleVerify = (recaptchaResponse) => {
    const { values, formikBag } = submitArgsRef.current

    handleSubmit(
      { ...values, 'g-recaptcha-response': recaptchaResponse },
      formikBag,
    )
  }

  const navigateToFatalError = () => {
    const { values } = submitArgsRef.current ?? {}
    const fromPageUrl = new URL(shareUrl)
    if (formValuesKey && values !== undefined) {
      const serializedValues =
        values?.review?.photos !== undefined
          ? { ...values, review: { ...values.review, photos: [] } }
          : values
      fromPageUrl.searchParams.set(
        formValuesKey,
        JSON.stringify(serializedValues),
      )
    }

    history.push('/error/fatal', {
      errorMessage: t('error_message.recaptcha_failed'),
      fromPage: fromPageUrl.toString(),
    })
  }

  const Recaptcha = () => (
    <HiddenReaptcha
      size="invisible"
      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      ref={(e) => {
        recaptchaRef.current = e
      }}
      onVerify={handleVerify}
      onError={navigateToFatalError}
      onExpire={navigateToFatalError}
      hl={i18n.language}
    />
  )

  return {
    Recaptcha,
    handlePresubmit,
  }
}
