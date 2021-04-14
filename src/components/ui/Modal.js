import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import styled from 'styled-components/macro'

// TODO: fix vertical centering

const Modal = styled(Dialog)`
  border-radius: 23px;
  padding: 23px 17px 23px 17px;
  width: 80%;
  max-height: 70%;
`

export default Modal
