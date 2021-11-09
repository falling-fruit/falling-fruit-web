import styled from 'styled-components/macro'

const Button = styled.button`
  background-color: ${(props) =>
    props.selected ? ({ theme }) => theme.orange : '#ffffff'};
  color: ${(props) =>
    props.selected ? '#ffffff' : ({ theme }) => theme.orange};
  flex-grow: 1;
  align-items: center;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  font-family: lato;
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

const ButtonToggle = ({ options, toggle, selectedIndex }) => {
  const renderButtons = () =>
    options.map((option, index) => (
      <Button
        selected={index === selectedIndex}
        onClick={() => toggle(index)}
        key={option}
      >
        {option}
      </Button>
    ))
  return <ButtonContainer>{renderButtons()}</ButtonContainer>
}

export default ButtonToggle
