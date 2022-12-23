import { StyledIconBase } from '@styled-icons/styled-icon'
import styled from 'styled-components/macro'

const CircleIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ backgroundColor }) => backgroundColor};
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;

  ${StyledIconBase} {
    width: 65%;
  }

  > svg {
    width: 1rem;
    height: auto;
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export default CircleIcon
