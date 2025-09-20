import styled from 'styled-components/macro'

import { TABS_HEIGHT_PX } from '../../constants/mobileLayout'
import ResetButton from './ResetButton'
import ReturnIcon from './ReturnIcon'

const StyledBackButton = styled(ResetButton).attrs((props) => ({
  children: <ReturnIcon />,
  ...props,
}))`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.9375rem;
  font-weight: bold;

  /* Make the touch target bigger */
  width: 75px;
  height: 100%;
  margin-inline-start: 10px;

  svg {
    height: 25px;
  }
`

const StyledTopBarNav = styled.div`
  height: ${TABS_HEIGHT_PX}px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    flex: 1;
    height: 100%;

    display: flex;
    align-items: center;
  }
`

const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & > *:not(:last-child) {
    margin: 0 8px;
  }
`

const TopBarNav = ({ left, onBack, title, rightIcons }) => (
  <StyledTopBarNav>
    <div>
      {onBack && <StyledBackButton onClick={onBack} tabindex={0} />}
      {left}
    </div>
    <h3>{title}</h3>
    <Icons>{rightIcons}</Icons>
  </StyledTopBarNav>
)

export default TopBarNav
