import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const StyledRadioDot = styled.div`
  display: ${({ $checked }) => !$checked && 'none'};
  height: 50%;
  width: 50%;
  border-radius: 50%;
  background: ${({ theme }) => theme.orange};
`

const StyledRadioContainer = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 7.5px 0 2px;
  width: 1.25em;
  height: 1.25em;
  border-radius: 50%;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.orange};
  background: ${({ theme }) => theme.transparentOrange};
  cursor: pointer;
  position: relative;
`

const StyledRadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  margin: 0;
`

const Radio = ({ checked, name, onChange, id, value, ...props }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  return (
    <StyledRadioContainer
      $checked={checked}
      style={isRTL ? { marginLeft: '0.75ex', marginRight: '0' } : {}}
      htmlFor={id}
      {...props}
    >
      <StyledRadioInput
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <StyledRadioDot $checked={checked} />
    </StyledRadioContainer>
  )
}

export default Radio
