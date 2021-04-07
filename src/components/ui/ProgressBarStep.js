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
  border: ${({ $nodeStatus, theme }) =>
      $nodeStatus === 'incomplete' ? theme.secondaryText : theme.orange}
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
    border-top: ${({ $nodeStatus, theme }) =>
        $nodeStatus === 'incomplete' ? theme.secondaryText : theme.orange}
      2.5px solid;
    width: calc(100% - 34px);
  }
`

const ProgressBarStep = ({ label, stepNumber, nodeStatus, onNodeClick }) => (
  <StyledProgressBarStep
    $nodeStatus={nodeStatus}
    // eslint-disable-next-line
    onClick={(event) => onNodeClick(stepNumber)}
  >
    <StyledCircleIcon
      backgroundColor={
        nodeStatus === 'incomplete'
          ? theme.secondaryBackground
          : theme.transparentOrange
      }
      $nodeStatus={nodeStatus}
    >
      {nodeStatus === 'complete' ? (
        <Check color={theme.orange}></Check>
      ) : (
        <PrimaryText
          color={
            nodeStatus === 'incomplete' ? theme.secondaryText : theme.orange
          }
        >
          {stepNumber}
        </PrimaryText>
      )}
    </StyledCircleIcon>
    <PrimaryText
      color={nodeStatus === 'incomplete' ? theme.tertiaryText : theme.orange}
    >
      {label}
    </PrimaryText>
  </StyledProgressBarStep>
)

export default ProgressBarStep
