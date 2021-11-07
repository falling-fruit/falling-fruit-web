import styled from 'styled-components/macro'

const Button = styled.button`
  background-color: ${(props) =>
    props.selected ? ({ theme }) => theme.orange : '#ffffff'};
  color: ${(props) =>
    props.selected ? '#ffffff' : ({ theme }) => theme.orange};
  flex-grow: 1;
  align-items: center;

  border-color: ${({ theme }) => theme.orange};
  outline: none none;
  // border-right-style: hidden;
  // border-bottom-style: hidden;
  font-weight: bold;
  font-family: lato;
`

const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: stretch;
  width: 100%;
  outline: none;
  border: none;
`

const ButtonToggle = ({ options, toggle, selectedIndex }) => {
  console.log(selectedIndex)

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
