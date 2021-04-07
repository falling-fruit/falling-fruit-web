import { React, useState } from 'react'
import styled from 'styled-components/macro'

import ProgressBarStep from '../ui/ProgressBarStep'

const StyledProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
`
const getStepStatus = (index, currentStep) => {
  const refactoredIndex = index + 1
  if (refactoredIndex === currentStep) {
    return 'active'
  } else if (refactoredIndex < currentStep) {
    return 'complete'
  } else {
    return 'incomplete'
  }
}

const ProgressBar = ({ labels, className, currentStep }) => {
  //is this the way to go, understand how rendering works with this
  //variable naming
  const [current, setCurrent] = useState(currentStep)

  const handleChange = (label) => {
    setCurrent(label)
    console.log(label)
    //how to do reduce redundancy in functions
  }

  return (
    <StyledProgressBar className={className}>
      {labels.map((label, index) => (
        <ProgressBarStep
          label={label}
          key={index} //good practice to have key
          stepNumber={index + 1}
          nodeStatus={getStepStatus(index, current)}
          //difference between implementing onClick = event -> right here
          onNodeClick={handleChange}
        />
      ))}
    </StyledProgressBar>
  )
}

export default ProgressBar
