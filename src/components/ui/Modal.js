import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { useIsDesktop } from '../../utils/useBreakpoint'
import { useInvisibleRecaptcha } from '../form/useInvisibleRecaptcha'
import Button from './Button'

const StyledModal = styled(Dialog)`
  border-radius: 0.375em;
  padding: 23px 17px;
  width: 80%;
  max-width: 800px;
  margin: 8vh auto;

  h3 {
    margin-block-start: 0;
  }
`

const Buttons = styled.div`
  margin-block-start: 20px;
  text-align: end;

  button {
    width: 110px;

    &:not(:last-child) {
      margin-inline-end: 12px;
    }
  }
`

const Modal = ({
  title,
  onDismiss,
  initialValues,
  validationSchema,
  onSubmit,
  children,
  initialDirty = false,
  ...props
}) => {
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const isDesktop = useIsDesktop()
  const { t } = useTranslation()
  const { Recaptcha, handlePresubmit: onPresubmit } =
    useInvisibleRecaptcha(onSubmit)

  return (
    <StyledModal
      aria-label={`${title} dialog`}
      onDismiss={onDismiss}
      isDesktop={isDesktop}
      {...props}
    >
      <h3>{title}</h3>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={isLoggedIn ? onSubmit : onPresubmit}
        initialStatus={{ dirty: initialDirty }}
      >
        {(props) => {
          const { dirty, isSubmitting, isValid, status } = props
          const isDirty = dirty || status.dirty
          return (
            <Form>
              {children}
              {!isLoggedIn && <Recaptcha />}
              <Buttons isDesktop={isDesktop}>
                <Button type="button" onClick={onDismiss} secondary>
                  {t('form.button.cancel')}
                </Button>
                <Button
                  disabled={!isDirty || isSubmitting || !isValid}
                  type="submit"
                >
                  {isSubmitting
                    ? t('form.button.submitting')
                    : t('form.button.submit')}
                </Button>
              </Buttons>
            </Form>
          )
        }}
      </Formik>
    </StyledModal>
  )
}

export default Modal
