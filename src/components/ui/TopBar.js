import styled from 'styled-components/macro'

const TopBar = styled.div`
  //display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
  flex: 1;
  //height: 100%;
  background: ${({ theme }) => theme.background};
  filter: drop-shadow(0px -1px 8px ${({ theme }) => theme.shadow});
  padding: 16px;
  border-radius: ${(props) => (props.rectangular ? '0' : '0 0 44px 44px')};
  transition: border-radius 0.2s ease-out-in;
`

export default TopBar
