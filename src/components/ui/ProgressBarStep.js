import React from 'react'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from './GlobalStyle'

const PrimaryText = styled.div`
  font-size: 15px;
  color: ${({ color }) => color};
`
const ProgressBarStep = ({ label, stepNumber }) => (
  <div>
    <CircleIcon>
      <PrimaryText color={theme.orange}>{stepNumber}</PrimaryText>
    </CircleIcon>
    <PrimaryText>{label}</PrimaryText>
  </div>
)
//Notes:
//Step component

export default ProgressBarStep
