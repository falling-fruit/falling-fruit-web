import styled from 'styled-components'

// Might become a navbar, so use <nav> for this
const DesktopHeader = styled.header`
  height: 70px;
  background-color: ${({ theme }) => theme.orange};
`

export default DesktopHeader
