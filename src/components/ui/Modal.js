import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import styled from 'styled-components/macro'

// TODO: fix vertical centering

const Modal = styled(Dialog)`
  border-radius: 23px;
  padding: 23px 17px;
  width: 80%;
  // TODO: other elements look very strange on desktop
  // TODO: min-width for smaller devices (width < 300px)
`

export default Modal
