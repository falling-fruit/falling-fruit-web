import '@reach/checkbox/styles.css'

import { CustomCheckboxContainer, CustomCheckboxInput } from '@reach/checkbox'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const StyledCheckmark = styled.div`
  display: ${({ $checked }) => !$checked && 'none'};
  height: 100%;
  width: 100%;
  background: url('/checkmark/checkmark.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const StyledCustomCheckboxContainer = styled(CustomCheckboxContainer)`
  input {
    cursor: pointer;
  }
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 7.5px 0 2px;
  border-radius: 0.1em;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.orange};
  background: ${({ checked, theme }) =>
    checked && checked !== 'mixed' ? theme.orange : theme.transparentOrange};

  & > span {
    width: 60%;
    height: 60%;
    z-index: 1;
    background: ${({ theme }) => theme.orange};
  }
`

const Checkbox = ({ checked, name, onChange, id, ...props }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <StyledCustomCheckboxContainer
      checked={checked}
      onChange={onChange}
      style={isRTL ? { marginLeft: '0.75ex', marginRight: '0' } : {}}
      {...props}
    >
      <CustomCheckboxInput id={id} name={name} />
      {checked === 'mixed' ? <span /> : <StyledCheckmark $checked={checked} />}
    </StyledCustomCheckboxContainer>
  )
}

export default Checkbox
