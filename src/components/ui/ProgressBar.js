import styled from 'styled-components/macro'

import ProgressBarStep from '../ui/ProgressBarStep'

const StyledProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
`
const getStepStatus = (index, step) => {
  if (index === step) {
    return 'active'
  } else if (index < step) {
    return 'complete'
  } else {
    return 'incomplete'
  }
}

const ProgressBar = ({ labels, className, step, onChange }) => (
  <StyledProgressBar className={className}>
    {labels.map((label, index) => (
      <ProgressBarStep
        label={label}
        key={index}
        stepNumber={index + 1}
        status={getStepStatus(index, step)}
        onClick={() => onChange(index)}
      >
        {index + 1}
      </ProgressBarStep>
    ))}
  </StyledProgressBar>
)

export default ProgressBar
