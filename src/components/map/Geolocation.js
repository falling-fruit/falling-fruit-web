import { rgba } from 'polished'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

const Heading = styled.div`
  position: absolute;
  top: 0;
  left: -35px;
  transform-origin: top center;
  transform: rotate(${({ heading }) => heading}deg);

  height: 55px;
  width: 70px;
  clip-path: polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%);
  // Fix gradient in Safari: https://css-tricks.com/thing-know-gradients-transparent-black/
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.orange},
    ${({ theme }) => rgba(theme.orange, 0)}
  );
`

const Pin = styled.div`
  cursor: pointer;
  position: absolute;
  z-index: 1;

  transform: translate(-50%, -50%);

  width: 28px;
  height: 28px;

  border-radius: 50%;
  background: ${({ theme }) => theme.orange};
`

const GeolocationWrapper = styled.div`
  position: relative;
  z-index: 3;

  &::before,
  &::after {
    content: '';
    width: 34px;
    height: 34px;

    position: absolute;
    transform: translate(-50%, -50%);
    transform-origin: 50% 50%;

    border-radius: 50%;
  }

  ${({ heading }) =>
    !heading &&
    css`
      &::before {
        z-index: 1;
        background: radial-gradient(
          ${({ theme }) => rgba(theme.orange, 0.75)},
          ${({ theme }) => rgba(theme.orange, 0)}
        );
        animation: 3s ease infinite pulseScale;
      }
    `}

  &::after {
    z-index: 3;
    box-shadow: 0 0 0 7px #fefefe inset;
    animation: 3s ease infinite pulseBoxShadow;
  }

  @keyframes pulseBoxShadow {
    0% {
      box-shadow: 0 0 0 7px #fefefe inset;
    }
    50% {
      box-shadow: 0 0 0 5px #fefefe inset;
    }
    0% {
      box-shadow: 0 0 0 7px #fefefe inset;
    }
  }

  @keyframes pulseScale {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
    }
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
`

const Geolocation = ({ heading, onClick, ...props }) => (
  <GeolocationWrapper {...props}>
    <Pin onClick={onClick} />
    {heading && <Heading heading={heading} />}
  </GeolocationWrapper>
)

export default Geolocation
