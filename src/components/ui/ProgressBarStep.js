import React from 'react'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from './GlobalStyle'

const PrimaryText = styled.div`
  font-size: 15px;
  color: ${({ color }) => color};
`
const StyledCircleIcon = styled(CircleIcon)`
  border: ${({ theme }) => theme.secondaryText} 2px solid;
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
    border-top: 2.5px solid black;
    width: calc(100% - 34px);
  }
`

const ProgressBarStep = ({ label, stepNumber }) => (
  <StyledProgressBarStep>
    <StyledCircleIcon backgroundColor={theme.secondaryBackground}>
      <PrimaryText color={theme.secondaryText}>{stepNumber}</PrimaryText>
    </StyledCircleIcon>
    <PrimaryText color={theme.tertiaryText}>{label}</PrimaryText>
  </StyledProgressBarStep>
)

export default ProgressBarStep
