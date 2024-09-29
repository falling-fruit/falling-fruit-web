import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import { Form, Formik } from 'formik'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { useInvisibleRecaptcha } from '../form/useInvisibleRecaptcha'
import Button from './Button'

const StyledModal = styled(Dialog)`
  border-radius: 0.375em;
  padding: 23px 17px;
  width: 80%;
  max-width: 800px;
  margin: 15vh auto;

  @media ${({ theme }) => theme.device.mobile} {
    margin: 8vh auto;
  }

  h3 {
    margin-top: 0;
  }
`

const Buttons = styled.div`
  margin-top: 20px;

  @media ${({ theme }) => theme.device.mobile} {
    text-align: center;
  }

  button {
    width: 130px;

    @media ${({ theme }) => theme.device.mobile} {
      width: 110px;
    }

    &:not(:last-child) {
      margin-right: 12px;
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
  const { Recaptcha, handlePresubmit: onPresubmit } =
    useInvisibleRecaptcha(onSubmit)

  return (
    <StyledModal
      aria-label={`${title} dialog`}
      onDismiss={onDismiss}
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
              <Buttons>
                <Button type="button" onClick={onDismiss} secondary>
                  Cancel
                </Button>
                <Button
                  disabled={!isDirty || isSubmitting || !isValid}
                  type="submit"
                >
                  {isSubmitting ? 'Submitting' : 'Submit'}
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
