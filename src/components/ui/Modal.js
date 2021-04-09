import '@reach/dialog/styles.css'

import { Dialog } from '@reach/dialog'
import styled from 'styled-components/macro'

const StyledDialog = styled(Dialog)`
  border-radius: 23px;
  width: 75%;
  height: 70%;
`
const Modal = ({ ...props }) => <StyledDialog {...props} />

export default Modal
