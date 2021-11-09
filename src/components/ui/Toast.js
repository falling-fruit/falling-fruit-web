import { ToastContainer } from 'react-toastify'
import styled from 'styled-components/macro'

const Toast = styled(ToastContainer).attrs({
  // custom props
  toastClassName: 'toast',
})`
  .Toastify__toast-theme--colored.Toastify__toast--success {
    background: #73cd7c;
  }

  .Toastify__toast-theme--colored.Toastify__toast--error {
    background: #ff2633;
  }
  .Toastify__toast {
    font-family: ${({ theme }) => theme.fonts};
  }
`

export default Toast
