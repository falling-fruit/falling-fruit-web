import styled from 'styled-components'

const LeftIcon = styled.div`
  border-radius: 50%;
  background-color: #5a5a5a;
  align-self: center;
  width: 25px;
  height: 25px;
`
const StyledPrimaryText = styled.h1`
    align-items: center
    font-weight: bold;
    color: #5A5A5A;
    font-size: 14px;
    line-height: 17px;
    margin:2px;
`
const StyledSecondaryText = styled.h2`
  align-items: center;
  font-weight: normal;
  color: #5a5a5a;
  font-size: 12px;
  line-height: 14px;
  margin: 2px;
`

const StyledListContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 25%;
`
// TODO: Adjust spacing between LeftIcon, TextContainer, and RightIcon
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 50%;
`
const RightIcon = styled.div`
  border-radius: 50%;
  width: 25px;
  height: 25px;
  align-self: center;
  background-color: #4183c4;
`

const ListEntry = ({ leftIcon, primaryText, secondaryText, rightIcon }) => (
  <StyledListContainer>
    <LeftIcon>{leftIcon}</LeftIcon>
    <TextContainer>
      <StyledPrimaryText>{primaryText}</StyledPrimaryText>
      <StyledSecondaryText>{secondaryText}</StyledSecondaryText>
    </TextContainer>
    <RightIcon>{rightIcon}</RightIcon>
  </StyledListContainer>
)

export default ListEntry
