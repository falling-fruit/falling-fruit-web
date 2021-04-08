import { React } from 'react'
import styled from 'styled-components/macro'

import ProgressBarStep from '../ui/ProgressBarStep'

const StyledProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
`
const getStepStatus = (index, currentStep) => {
  const refactoredIndex = index
  if (refactoredIndex === currentStep) {
    return 'active'
  } else if (refactoredIndex < currentStep) {
    return 'complete'
  } else {
    return 'incomplete'
  }
}

const ProgressBar = ({ labels, className, currentStep, onChange }) => (
  <StyledProgressBar className={className}>
    {labels.map((label, index) => (
      <ProgressBarStep
        label={label}
        key={index}
        stepNumber={index + 1}
        status={getStepStatus(index, currentStep)}
        onClick={() => onChange(index)}
      />
    ))}
  </StyledProgressBar>
)

export default ProgressBar
