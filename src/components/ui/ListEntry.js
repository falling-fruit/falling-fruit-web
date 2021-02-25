import styled from 'styled-components'

const LeftIcon = styled.div`
  border-radius: 50%;
  align-self: center;
  max-width: 36px;
  max-height: 36px;
  margin: 10px 18px 11px 22px;
  overflow: hidden;
`
const StyledPrimaryText = styled.h1`
    align-items: center
    font-weight: bold;
    color: #5A5A5A;
    font-size: 14px;
    margin-top:14px;
    margin-bottom:auto;
`
const StyledSecondaryText = styled.h2`
  align-items: center;
  font-weight: normal;
  color: #5a5a5a;
  font-size: 12px;
  margin-top: auto;
  margin-bottom: 14px;
`

const StyledListContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: space-around;
`
// TODO: Adjust spacing between LeftIcon, TextContainer, and RightIcon
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  flex-grow: 2;
  margin-inline-end: auto;
`
const RightIcon = styled.div`
  width: 16px;
  height: 16px;
  align-self: center;
  margin-right: 22px;
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
