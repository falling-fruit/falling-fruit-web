import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import { Check } from '@styled-icons/boxicons-regular'
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
      {props.checked === true ? (
        <StyledCheck size="21" />
      ) : (
        <span aria-hidden></span>
      )}
    </CustomCheckboxContainer>
  </div>
))
Checkbox.displayName = 'Checkbox'

const StyledCheck = styled(Check)`
  color: white;
  position: absolute;
  top: -3px;
  left: -3px;
`

const StyledCheckbox = styled(Checkbox)`
  [data-reach-custom-checkbox-container] {
    position: relative;
    width: 21px;
    height: 21px;
    background: ${(props) => {
      if (props.checked === true) {
        return ({ theme }) => theme.orange
      } else {
        return ({ theme }) => theme.transparentOrange
      }
    }};
    border: 3px solid ${({ theme }) => theme.orange};
    box-sizing: border-box;
    border-radius: 4px;
  }

  [data-reach-custom-checkbox-container] > span {
    display: block;
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    transition: transform 200ms ease-out, background 200ms ease-out;
    zindex: 1;
    background: ${(props) => {
      if (props.checked === true) {
        return ({ theme }) => theme.orange
      } else if (props.checked === false) {
        return ({ theme }) => theme.transparentOrange
      } else {
        return ({ theme }) => theme.orange
      }
    }};
    transform: ${(props) => {
      if (props.checked === 'mixed') {
        return `scaleX(1) scaleY(1)`
      } else {
        return `scaleX(1) scaleY(1)`
      }
    }};
  }
`

export default StyledCheckbox
