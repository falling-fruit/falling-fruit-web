import styled from 'styled-components/macro'

import { NAVIGATION_BAR_HEIGHT_PX } from '../../constants/mobileLayout'
import { useIsDesktop } from '../../utils/useBreakpoint'

export const ProgressButtons = styled.div`
  margin-block-start: 16px;
  margin-block-end: 16px;
  text-align: center;

  button {
    width: 110px;

    &:not(:last-child) {
      margin-inline-end: 12px;
    }
  }
`

const StyledFormDiv = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  padding-block-end: env(safe-area-inset-bottom, 0);
  overflow: auto;

  &::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    height: env(safe-area-inset-top, 0);
    background: ${({ theme }) => theme.secondaryBackground};
  }

  ${({ isDesktop }) =>
    !isDesktop &&
    `
    padding-inline: 1em;

    textarea {
      height: 100px;

      @media (max-device-height: 600px) {
        height: 50px;
      }
    }
    margin-block-start: calc(${NAVIGATION_BAR_HEIGHT_PX}px + env(safe-area-inset-top, 0));
  `}
`

export const StyledForm = ({ children, ...props }) => {
  const isDesktop = useIsDesktop()

  return (
    <StyledFormDiv isDesktop={isDesktop} {...props}>
      {children}
    </StyledFormDiv>
  )
}
