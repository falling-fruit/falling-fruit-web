import styled from 'styled-components/macro'

/*import { theme } from './GlobalStyle'*/
import ResetButton from './ResetButton'

const StyledResetButton = styled(ResetButton)`
  border-radius: 7px;
  height: 100px;
  width: 100px;
  background-color: gray;
  position: relative;
  border: 4px solid ${({ selected, theme }) => selected && theme.blue};

  h5 {
    bottom: 5%;
    left: 5%;
    z-index: 2;
    position: absolute;
    color: black;
  }
`

const TileButton = ({ label, selected, onClick }) => (
  <StyledResetButton selected={selected} onClick={onClick}>
    <h5>{label}</h5>
  </StyledResetButton>
)

export default TileButton
