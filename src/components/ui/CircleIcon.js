import { StyledIconBase } from '@styled-icons/styled-icon'
import styled from 'styled-components'

const CircleIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ backgroundColor }) => backgroundColor};
  padding: 0;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  border-radius: 50%;
  overflow: hidden;

  ${StyledIconBase} {
    width: 65%;
    color: #fff;
  }
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export default CircleIcon
