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
    // TODO: ask Siraj what % to use
    width: 60%;
    color: #fff;
  }
`

export default CircleIcon
