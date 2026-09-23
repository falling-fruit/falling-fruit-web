import styled from 'styled-components/macro'

const BlurredSafeArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top, 0);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.3);
  z-index: 1000;
  pointer-events: none;
`

export default BlurredSafeArea
