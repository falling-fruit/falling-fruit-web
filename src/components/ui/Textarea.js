import styled from 'styled-components/macro'

import { useIsDesktop } from '../../utils/useBreakpoint'
import { validatedColor } from '../ui/GlobalStyle'

const TextareaElement = styled.textarea`
  border: 1px solid ${validatedColor()};
  box-sizing: border-box;
  border-radius: 0.375em;
  padding: 0.75rem 1rem;
  resize: vertical;
  color: ${({ theme }) => theme.secondaryText};
  font-family: inherit;
  font-size: 1rem;
  width: 100%;
  height: 8em;

  &::placeholder {
    color: ${({ theme }) => theme.tertiaryText};
    font-family: ${({ theme }) => theme.fonts};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.blue};
  }

  &:hover {
    border-color: ${({ theme }) => theme.text};
  }

  ${({ isDesktop }) =>
    !isDesktop &&
    `
    height: 6.5em;

    @media (max-height: 600px) {
      height: 4.5em;
    }
  `}
`
const Textarea = ({ children, ...props }) => {
  const isDesktop = useIsDesktop()

  return (
    <TextareaElement isDesktop={isDesktop} {...props}>
      {children}
    </TextareaElement>
  )
}

export default Textarea
