import { LeftArrowAlt, RightArrowAlt } from '@styled-icons/boxicons-regular'
import { Form, Formik } from 'formik'
import { Children, useState } from 'react'
import styled from 'styled-components/macro'

import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'

const StyledForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;

  > div:first-child {
    // Expand form content up until progress bar
    flex: 1;
  }
`

const StyledProgressBar = styled(ProgressBar)`
  padding: 0 35px;
`

export const ProgressButtons = styled.div`
  margin-bottom: 16px;
  text-align: center;

  button {
    // TODO: Should width be manually adjusted?
    width: 130px;

    &:not(:last-child) {
      margin-right: 12px;
    }
  }
`

const FormikStep = ({ label: _label, children }) => <>{children}</>

const FormikStepper = ({ children, onSubmit, ...props }) => {
  const steps = Children.toArray(children)
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentChild = steps[step]
  const isLastStep = step === steps.length - 1

  const handleSubmit = async (values, helpers) => {
    if (isLastStep) {
      await onSubmit(values, helpers)
      setCompleted(true)
    } else {
      setStep((s) => s + 1)
      // helpers.setTouched({})
    }
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <StyledForm>
          <div>{currentChild}</div>

          <ProgressButtons>
            {step > 0 && (
              <Button
                secondary
                type="button"
                disabled={isSubmitting}
                onClick={() => setStep((s) => s - 1)}
                leftIcon={<LeftArrowAlt />}
              >
                Previous
              </Button>
            )}
            <Button
              disabled={isSubmitting}
              type="submit"
              rightIcon={<RightArrowAlt />}
            >
              {isSubmitting ? 'Submitting' : isLastStep ? 'Submit' : 'Next'}
            </Button>
          </ProgressButtons>

          <StyledProgressBar
            labels={steps.map((child) => child.props.label)}
            step={completed ? steps.length + 1 : step}
            onChange={setStep}
          />
        </StyledForm>
      )}
    </Formik>
  )
}

export { FormikStepper, FormikStep as Step }
