import { rgba } from 'polished'
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

  width: 22px;
  height: 22px;
  border: 6px solid #fefefe;
  border-radius: 50%;
  background: ${({ theme }) => theme.orange};
`

const GeolocationWrapper = styled.div`
  position: relative;
`

const Geolocation = ({ heading, onClick, ...props }) => (
  <GeolocationWrapper {...props}>
    <Pin onClick={onClick} />
    {heading && <Heading heading={heading} />}
  </GeolocationWrapper>
)

export default Geolocation
