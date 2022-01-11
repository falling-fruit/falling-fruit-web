import styled from 'styled-components/macro'

import NavBack from './NavBack'

const StyledHeaderPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  > div:last-child {
    overflow: auto;
    flex: 1;
  }
`

const HeaderPane = ({ nav, children, className }) => (
  <StyledHeaderPane className={className}>
    {nav}
    {children}
  </StyledHeaderPane>
)

const NavPane = (props) => <HeaderPane nav={<NavBack isEntry />} {...props} />

export { HeaderPane, NavPane }
