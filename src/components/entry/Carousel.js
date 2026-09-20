import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { useDispatch, useSelector } from 'react-redux'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import styled from 'styled-components/macro'

import {
  openLightbox,
  selectReviewsWithPhotos,
  setCarouselIndex,
} from '../../redux/locationSlice'

const Carousel = styled(ResponsiveCarousel)`
  width: 100%;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  mask-image: radial-gradient(white, black);
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  img {
    width: 100%;
    object-fit: cover;
    height: 250px;
    background-color: white;
    display: block;
  }

  .control-dots {
    display: flex;
    width: auto;
    inset-inline-end: 0;

    .dot {
      height: 10px;
      width: 10px;
      opacity: 1;
      margin-block: 0;
      margin-inline: 0 10px;
      box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};
      background: ${({ theme }) => theme.secondaryBackground};

      &.selected {
        background: ${({ theme }) => theme.orange};
      }
    }
  }
`

Carousel.defaultProps = {
  showThumbs: false,
  showStatus: false,
  showArrows: false,
  emulateTouch: true,
  useKeyboardArrows: true,
}

const EntryCarousel = ({ autoPlay = false, swipeable = true }) => {
  const dispatch = useDispatch()
  const reviewsWithPhotos = useSelector(selectReviewsWithPhotos)
  const carouselIndex = useSelector((state) => state.location.carouselIndex)

  const lightboxIndices = reviewsWithPhotos
    .map((review, ri) => review.photos.map((_, pi) => [ri, pi]))
    .flat()
  const allReviewPhotos = reviewsWithPhotos
    .map((review) => review.photos)
    .flat()

  const onClickCarousel = (idx) => {
    const [reviewIndex, photoIndex] = lightboxIndices[idx]
    dispatch(openLightbox({ reviewIndex, photoIndex }))
  }

  if (allReviewPhotos.length === 0) {
    return null
  }

  const hasMultiple = allReviewPhotos.length > 1

  return (
    <Carousel
      selectedItem={carouselIndex}
      onChange={(index) => dispatch(setCarouselIndex(index))}
      onClickItem={onClickCarousel}
      showIndicators={hasMultiple}
      autoPlay={autoPlay && hasMultiple}
      swipeable={swipeable && hasMultiple}
      infiniteLoop={hasMultiple}
      interval={5000}
      stopOnHover
    >
      {allReviewPhotos.map((photo) => (
        <img key={photo.id} src={photo.medium} alt="" />
      ))}
    </Carousel>
  )
}

export default EntryCarousel
