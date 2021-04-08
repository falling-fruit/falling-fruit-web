import { Check } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from './GlobalStyle'

const PrimaryText = styled.div`
  font-size: 15px;
  color: ${({ color }) => color};
`
const StyledCircleIcon = styled(CircleIcon)`
  border: ${({ $status, theme }) =>
      $status === 'incomplete' ? theme.secondaryText : theme.orange}
    2px solid;
`

const StyledProgressBarStep = styled.div`
  position: relative;
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

const ProgressBarStep = ({ label, stepNumber, status, onClick }) => (
  <StyledProgressBarStep $status={status}>
    <StyledCircleIcon
      backgroundColor={
        status === 'incomplete'
          ? theme.secondaryBackground
          : theme.transparentOrange
      }
      $status={status}
      onClick={onClick}
    >
      {status === 'complete' ? (
        <Check color={theme.orange}></Check>
      ) : (
        <PrimaryText
          color={status === 'incomplete' ? theme.secondaryText : theme.orange}
        >
          {stepNumber}
        </PrimaryText>
      )}
    </StyledCircleIcon>
    <PrimaryText
      color={status === 'incomplete' ? theme.tertiaryText : theme.orange}
    >
      {label}
    </PrimaryText>
  </StyledProgressBarStep>
)

export default ProgressBarStep
