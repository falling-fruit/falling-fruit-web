import React from 'react'
import styled from 'styled-components/macro'

import ProgressBarStep from '../ui/ProgressBarStep'

const StyledProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
`

const ProgressBar = ({ labels, className, currentStep }) => (
  <StyledProgressBar className={className}>
    {labels.map((label, index) => (
      <ProgressBarStep
        label={label}
        key={index}
        stepNumber={index + 1}
        isActive={currentStep === index}
      />
    ))}
  </StyledProgressBar>
)

export default ProgressBar
