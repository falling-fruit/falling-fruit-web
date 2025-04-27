import { ToastContainer } from 'react-toastify'
import styled from 'styled-components/macro'

/*
 * At 480px the component switches from full width to bounded
 * we add a margin on top so the X is visible better
 */
const Toast = styled(ToastContainer).attrs({
  toastClassName: 'toast',
})`
  .Toastify {
    &__toast-icon {
      width: 30px;
    }

    &__toast {
      font-weight: bold;

      border-radius: 0.375em;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12);
      @media (max-width: 480px) {
        margin-top: 0.5em;
      }
    }
  }
`

export default Toast
