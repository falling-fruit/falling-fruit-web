import { ToastContainer } from 'react-toastify'
import styled from 'styled-components/macro'

const Toast = styled(ToastContainer).attrs({
  toastClassName: 'toast',
})`
  .Toastify {
    &__toast-icon {
      width: 30px;
    }

    &__toast {
      font-weight: bold;

      border-radius: 8px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);

      @media (max-width: 767px) {
        margin: 10px 10px 0;
      }
    }
  }
`

export default Toast
