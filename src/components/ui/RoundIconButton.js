import styled from 'styled-components/macro'

import IconButton from './IconButton'

const RoundIconButton = styled(IconButton)`
  background-color: rgba(0, 0, 0, 0.45);
  border: none;
  svg {
    color: white;
  }
  ${({ opaque }) => opaque && `opacity: 0.5; cursor: help;`}
`

RoundIconButton.defaultProps = {
  size: 48,
}

export default RoundIconButton
