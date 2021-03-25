import { Loader } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

const LoadingIndicatorWrapper = styled.div`
  --size: 18px;

  @media only screen and ${({ theme }) => theme.device.mobile} {
    --size: 16px;
  }

  ${(props) =>
    props.cover
      ? `width: 100%;
  height: 100%;`
      : `position: absolute;
  bottom: 10px;
  left: 10px;`}

  z-index: 1;
  display: flex;
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  font-size: var(--size);
  color: ${({ theme }) => theme.secondaryText};

  svg {
    width: calc(var(--size) * 1.75);
    height: calc(var(--size) * 1.75);
    margin-right: ${(props) => (props.vertical ? 0 : '0.25em')};
    --animation: spin 1.2s infinite ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      --animation: none;
    }

    -webkit-animation: var(--animation);
    -moz-animation: var(--animation);
    -o-animation: var(--animation);
    animation: var(--animation);

    @-moz-keyframes spin {
      from {
        -moz-transform: rotate(0deg);
      }
      to {
        -moz-transform: rotate(360deg);
      }
    }
    @-webkit-keyframes spin {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`
/**
 * LoadingIndicator - animated loading indicator
 *
 * props:
 * - cover {boolean} - covers container with loading state when true
 * - vertical {boolean} - arranged vertically when true
 */
export default function LoadingIndicator(props) {
  return (
    <LoadingIndicatorWrapper {...props}>
      <Loader /> Loading...
    </LoadingIndicatorWrapper>
  )
}
