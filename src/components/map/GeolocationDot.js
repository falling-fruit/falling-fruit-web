import { rgba } from 'polished'
import { useDispatch, useSelector } from 'react-redux'
import { css } from 'styled-components'
import styled from 'styled-components/macro'

import { MIN_GEOLOCATION_ZOOM } from '../../constants/map'
import {
  geolocationCentering,
  GeolocationState,
} from '../../redux/geolocationSlice'

const Heading = styled.div`
  position: absolute;
  bottom: 0;
  left: -35px;
  transform-origin: bottom center;
  transform: rotate(${({ heading }) => heading}deg);

  height: 55px;
  width: 70px;
  clip-path: polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%);
  // Fix gradient in Safari: https://css-tricks.com/thing-know-gradients-transparent-black/
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.orange},
    ${({ theme }) => rgba(theme.orange, 0)}
  );
`

const Pin = styled.div`
  position: absolute;
  z-index: 1;

  transform: translate(-50%, -50%);

  width: 28px;
  height: 28px;

  border-radius: 50%;
  background: ${({ theme }) => theme.orange};
`

const GeolocationWrapper = styled.div`
  ${({ isClickable }) => isClickable && 'cursor: pointer;'};
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

  ${({ hasHeading, isPulsing }) =>
    !hasHeading &&
    isPulsing &&
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

const GeolocationDot = () => {
  const { googleMap } = useSelector((state) => state.map)
  const { geolocation, geolocationState } = useSelector(
    (state) => state.geolocation,
  )
  const dispatch = useDispatch()

  const handleClick = () => {
    if (geolocation && geolocationState === GeolocationState.DOT_ON) {
      dispatch(geolocationCentering(geolocation))
      googleMap.panTo({ lat: geolocation.latitude, lng: geolocation.longitude })
      if (googleMap.getZoom() < MIN_GEOLOCATION_ZOOM) {
        googleMap.setZoom(MIN_GEOLOCATION_ZOOM)
      }
    }
  }

  return (
    <GeolocationWrapper
      onClick={handleClick}
      hasHeading={!!geolocation?.heading}
      isPulsing={geolocationState !== GeolocationState.DOT_ON}
      isClickable={geolocationState === GeolocationState.DOT_ON}
    >
      <Pin />
      {geolocation && geolocation.heading !== null && (
        <Heading heading={geolocation.heading} />
      )}
    </GeolocationWrapper>
  )
}

export default GeolocationDot
