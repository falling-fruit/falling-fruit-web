import styled from 'styled-components/macro'

// https://codesandbox.io/s/6v7n1vr8yn?file=/src/index.js

const CheckBoxWrapper = styled.div`
  position: relative;

  label {
    font-weight: bold;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.headerText};
  }
`
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: ${({ theme }) => theme.tertiaryText};
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: ${({ theme }) => theme.orange};
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`

const ToggleSwitch = ({ label }) => (
  <CheckBoxWrapper>
    <CheckBox id="checkbox" type="checkbox" />
    <CheckBoxLabel htmlFor="checkbox" />
    <label>{label}</label>
  </CheckBoxWrapper>
)

export default ToggleSwitch
