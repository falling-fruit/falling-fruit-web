import styled from 'styled-components/macro'

const Heading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, 0);
  transform: rotate(${({ heading }) => heading}deg);

  height: 50px;
  width: 30px;
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.orange},
    transparent
  );
`

const Pin = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);

  z-index: 1;
  width: 22px;
  height: 22px;
  border: 6px solid #fefefe;
  border-radius: 50%;
  background: ${({ theme }) => theme.orange};
`

const GeolocationWrapper = styled.div`
  position: relative;
`

const Geolocation = ({ heading, ...props }) => (
  <GeolocationWrapper {...props}>
    <Pin />
    {heading && <Heading heading={heading} />}
  </GeolocationWrapper>
)

export default Geolocation
