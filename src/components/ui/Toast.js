import { ToastContainer } from 'react-toastify'
import styled from 'styled-components/macro'

const Toast = styled(ToastContainer).attrs({
  toastClassName: 'toast',
})`
  .Toastify {
    &__toast {
      font-size: 16px;
      font-weight: bold;
    }
  }
  @media only screen and (max-width: 480px) {
    .Toastify__toast {
      border-radius: 4px;
      margin: 90px 10px 0;
    }
  }
`

export default Toast
