import styled from 'styled-components/macro'

const ResetButton = styled.button`
  // background: none;
  // border: none;
  // padding: 4px;
  // font-family: inherit;
  // color: #666;
  // outline: inherit;
  // TODO: should outline be removed? a11y

  ${({ disabled }) => !disabled && 'cursor: pointer;'}

  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .password-eye-icon {
    display: inline-flex;
    transform: scale(0.65); /* 👈 YAHI SIZE CONTROL */
    transform-origin: center;
  }

  &:not([disabled]) {
    cursor: pointer;
  }
`

export default ResetButton
