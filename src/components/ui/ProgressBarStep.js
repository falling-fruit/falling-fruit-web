import { Check } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'

const StyledCircleIcon = styled(CircleIcon)`
  color: ${({ $status, theme }) =>
    $status === 'incomplete' ? theme.secondaryText : theme.orange};
  background-color: ${({ $status, theme }) =>
    $status === 'incomplete'
      ? theme.secondaryBackground
      : theme.transparentOrange};
  border: ${({ $status, theme }) =>
      $status === 'incomplete' ? theme.secondaryText : theme.orange}
    2px solid;
`

const StyledProgressBarStep = styled.div`
  position: relative;
  font-size: 15px;
  color: ${({ $status, theme }) =>
    $status === 'incomplete' ? theme.tertiaryText : theme.orange};

  & + & {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }

  & + &::before {
    top: calc(50% - 0.6rem);
    right: 36px;
    height: 100%;
    position: absolute;
    align-self: center;
    content: '';
    border-top: ${({ theme }) => theme.secondaryText} 2.5px solid;
    width: calc(100% - 34px);
  }

  // TODO: fix specificity of ::before CSS

  &::before {
    border-color: ${({ $status, theme }) =>
      $status === 'incomplete' ? theme.secondaryText : theme.orange} !important;
  }
`
const StyledCheck = styled(Check)`
  color: ${({ theme }) => theme.orange};
`

const ProgressBarStep = ({ label, stepNumber, status, onClick }) => (
  <StyledProgressBarStep $status={status}>
    <StyledCircleIcon $status={status} onClick={onClick}>
      {status === 'complete' ? (
        <StyledCheck></StyledCheck>
      ) : (
        <div> {stepNumber} </div>
      )}
    </StyledCircleIcon>
    <div> {label} </div>
  </StyledProgressBarStep>
)

export default ProgressBarStep
