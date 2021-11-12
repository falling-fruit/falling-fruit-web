import styled from 'styled-components/macro'

const Button = styled.button`
  background-color: ${(props) =>
    props.selected ? ({ theme }) => theme.orange : '#ffffff'};
  color: ${(props) =>
    props.selected ? '#ffffff' : ({ theme }) => theme.orange};
  flex-grow: 1;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
  border: 3px ${({ theme }) => theme.orange} solid;
  &:first-child {
    border-radius: 3px 0 0 3px;
  }
  &:last-child {
    border-radius: 0 3px 3px 0;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: stretch;
  width: 100%;
`

const ButtonToggle = ({ options, onChange, value }) => (
  <ButtonContainer>
    {options.map((option) => (
      <Button
        selected={option.value === value}
        onClick={() => onChange(option)}
        key={option.value}
      >
        {option.label}
      </Button>
    ))}
  </ButtonContainer>
)

export default ButtonToggle
