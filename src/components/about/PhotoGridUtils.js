import styled from 'styled-components/macro'

import { useIsDesktop } from '../../utils/useBreakpoint'

const StyledGridDiv = styled.div`
  color: ${({ theme }) => theme.secondaryText};
  display: grid;

  ${({ isDesktop, float }) =>
    !isDesktop
      ? `
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    margin-block-start: 17px;
    margin-block-end: 17px;
    justify-content: center;
    float: 'block-start';
  `
      : `
    margin: 16px;
    gap: 8px;
    grid-template-columns: 156px auto;
    float: ${float || 'inline-end'};
  `}
`

export const Grid = ({ children, ...props }) => {
  const isDesktop = useIsDesktop()

  return (
    <StyledGridDiv isDesktop={isDesktop} {...props}>
      {children}
    </StyledGridDiv>
  )
}

const StyledImageImg = styled.img`
  object-fit: cover;
  display: block;

  ${({ isDesktop }) =>
    !isDesktop
      ? `
    width: 100%;
    max-height: 250px;
    height: auto;
  `
      : `
    width: 156px;
    height: 195px;
  `}
`

export const Image = ({ ...props }) => {
  const isDesktop = useIsDesktop()

  return <StyledImageImg isDesktop={isDesktop} {...props} />
}
