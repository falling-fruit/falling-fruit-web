import styled from 'styled-components/macro'

import ResetButton from './ResetButton'

const ButtonWrapper = styled.div`
  position: relative;

  label {
    bottom: 5%;
    left: 2%;
    z-index: 1;
    position: absolute;
    color: black;
  }
`

const StyledResetButton = styled(ResetButton)`
  border-radius: 7px;
  height: 100px;
  width: 100px;
  background-color: gray;
  position: relative;
`

const TileButton = ({ label }) => (
  <ButtonWrapper>
    <label>{label}</label>
    <StyledResetButton />
  </ButtonWrapper>
)

export default TileButton
