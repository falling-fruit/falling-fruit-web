import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { useDispatch, useSelector } from 'react-redux'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import styled from 'styled-components/macro'

import { openLightbox } from '../../redux/locationSlice'

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
`

Carousel.defaultProps = {
  showThumbs: false,
  showStatus: false,
  showArrows: false,
  emulateTouch: true,
  useKeyboardArrows: true,
}

const EntryCarousel = () => {
  const dispatch = useDispatch()
  const { reviews } = useSelector((state) => state.location)

  const reviewsWithPhotos = reviews.filter((review) => review.photos.length > 0)
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

  return (
    <Carousel
      onClickItem={onClickCarousel}
      showIndicators={allReviewPhotos.length > 1}
    >
      {allReviewPhotos.map((photo) => (
        <img key={photo.id} src={photo.medium} alt="entry" />
      ))}
    </Carousel>
  )
}

export default EntryCarousel
