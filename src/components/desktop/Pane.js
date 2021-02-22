import styled from 'styled-components'

const Pane = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
  resize: horizontal;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
  min-width: 300px;
  box-shadow: 2px 0px 8px rgba(0, 0, 0, 0.12);
`

export default Pane
