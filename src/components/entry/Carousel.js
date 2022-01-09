import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import styled from 'styled-components/macro'

const Carousel = styled(ResponsiveCarousel)`
  width: 100%;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  img {
    width: 100%;
    object-fit: cover;
    height: 250px;
  }

  .control-dots {
    display: flex;
    width: auto;
    right: 0;

    .dot {
      height: 10px;
      width: 10px;
      opacity: 1;
      margin: 0 10px 0 0;
      box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};
      background: ${({ theme }) => theme.secondaryBackground};

      &.selected {
        background: ${({ theme }) => theme.orange};
      }
    }
  }
  @media ${({ theme }) => theme.device.mobile} {
    ${({ isFullScreen }) =>
      !isFullScreen && `border-radius: 13px 13px 0 0; pointer-events: none;`}
  }
`

Carousel.defaultProps = {
  showThumbs: false,
  showStatus: false,
  showArrows: false,
  emulateTouch: true,
  useKeyboardArrows: true,
}

export default Carousel
