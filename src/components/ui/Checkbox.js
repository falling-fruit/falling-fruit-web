import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import React from 'react'
import styled from 'styled-components'

const Checkbox = React.forwardRef((props, ref) => (
  <div className={props.className}>
    <CustomCheckboxContainer>
      <CustomCheckboxInput
        checked={props.checked}
        onChange={props.onChange}
        ref={ref}
        {...props}
      />
      <span aria-hidden />
    </CustomCheckboxContainer>
  </div>
))
Checkbox.displayName = 'Checkbox'

const StyledCheckbox = styled(Checkbox)`
  [data-reach-custom-checkbox-container] {
    position: static;
    width: 21px;
    height: 21px;
    left: 0px;
    top: 0px;
    background: ${({ theme }) => theme.transparentOrange};
    border: 3px solid ${({ theme }) => theme.orange};
    box-sizing: border-box;
    border-radius: 4px;
  }

  span {
    display: block;
    position: absolute;
    width: 60%;
    height: 60%;
    top: 50%;
    left: 50%;
    transition: transform 200ms ease-out, background 200ms ease-out;
    zindex: 1;
    background: ${(props) => {
      if (props.checked === true) {
        return ({ theme }) => theme.orange
      } else if (props.checked === false) {
        return ({ theme }) => theme.transparentOrange
      } else {
        return ({ theme }) => theme.transparentOrange
      }
    }};
    transform: ${(props) => {
      if (props.checked === true) {
        return `translate(-50%, -50%) scaleX(1) scaleY(1)`
      } else if (props.checked === 'mixed') {
        return `translate(-50%, -50%) scaleX(1) scaleY(1)`
      } else {
        return `translate(-50%, -50%) scaleX(1) scaleY(1)`
      }
    }};
  }
`

export default StyledCheckbox
