import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import FormikAllSteps from './FormikAllSteps'
import { FormikStepper } from './FormikStepper'
import { useInvisibleRecaptcha } from './useInvisibleRecaptcha'

const StyledForm = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
  overflow: auto;

  @media ${({ theme }) => theme.device.desktop} {
    height: 100%;
  }

  @media ${({ theme }) => theme.device.mobile} {
    padding: 8px 27px 20px;
    margin-top: 80px;

    textarea {
      height: 100px;

      @media (max-device-height: 600px) {
        height: 50px;
      }
    }
  }
`

export const FormWrapper = ({
  children,
  onSubmit,
  validate,
  initialValues,
  stepped = false,
  renderButtons,
}) => {
  const StepDisplay = stepped ? FormikStepper : FormikAllSteps
  const isLoggedIn = useSelector((state) => !!state.auth.user)
  const { Recaptcha, onPresubmit } = useInvisibleRecaptcha(onSubmit)

  return (
    <StyledForm>
      <StepDisplay
        validateOnChange={false}
        validate={validate}
        initialValues={initialValues}
        validateOnMount
        onSubmit={isLoggedIn ? onSubmit : onPresubmit}
        renderButtons={renderButtons}
      >
        {children}
        {!isLoggedIn && <Recaptcha />}
      </StepDisplay>
    </StyledForm>
  )
}
