import { Loader } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

const Spinner = styled(Loader)`
  width: 1.75rem;
  height: 1.75rem;

  --animation: spin 1.2s infinite ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    --animation: none;
  }

  -webkit-animation: var(--animation);
  -moz-animation: var(--animation);
  -o-animation: var(--animation);
  animation: var(--animation);

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
export default Spinner
