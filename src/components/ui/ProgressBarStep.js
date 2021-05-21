import { Check } from '@styled-icons/boxicons-regular'
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
  svg {
    color: ${({ theme }) => theme.orange};
  }
`

const StyledProgressBarStep = styled.div`
  position: relative;
  font-size: 0.9375rem;
  color: ${({ $status, theme }) =>
    $status === 'incomplete' ? theme.tertiaryText : theme.orange};

  > div:last-child {
    // Step Label
    text-align: center;
    width: 36px;
    margin-top: 4px;
    font-size: 0.625rem;
  }

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
    width: 100%;
    z-index: -1;
  }

  // TODO: fix specificity of ::before CSS

  &::before {
    border-color: ${({ $status, theme }) =>
      $status === 'incomplete' ? theme.secondaryText : theme.orange} !important;
  }
`

const ProgressBarStep = ({ label, children, status, onClick }) => (
  <StyledProgressBarStep $status={status}>
    <StyledCircleIcon $status={status} onClick={onClick}>
      {status === 'complete' ? <Check /> : <div>{children}</div>}
    </StyledCircleIcon>
    <div>{label}</div>
  </StyledProgressBarStep>
)

export default ProgressBarStep
