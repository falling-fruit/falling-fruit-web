import styled from 'styled-components/macro'

import IconButton from './IconButton'
import { OVERLAY_BACKGROUND } from './SquareIconButton'

const RoundIconButton = styled(IconButton)`
  background-color: ${OVERLAY_BACKGROUND};
  border: none;
  svg {
    color: white;
  }
  ${({ opaque }) => opaque && `opacity: 0.5; cursor: help;`}
`

RoundIconButton.defaultProps = {
  size: 50,
}

export default RoundIconButton
