import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import styled from 'styled-components/macro'

import { openLightbox } from '../../redux/locationSlice'

// Styled component for side dots
const SideDot = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s;
  &:hover {
    background: #fff;
  }
`

const LeftDot = styled(SideDot)`
  left: 10px;
`

const RightDot = styled(SideDot)`
  right: 10px;
`

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
    inset-inline-end: 0;

    @media (max-width: 768px) {
      display: none; /* Hide bottom dots on mobile */
    }

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

const EntryCarousel = () => {
  const dispatch = useDispatch()
  const { reviews } = useSelector((state) => state.location)
  const [currentSlide, setCurrentSlide] = useState(0)

  const reviewsWithPhotos = reviews.filter((review) => review.photos.length > 0)
  const lightboxIndices = reviewsWithPhotos
    .map((review, ri) => review.photos.map((_, pi) => [ri, pi]))
    .flat()
  const allReviewPhotos = reviewsWithPhotos
    .map((review) => review.photos)
    .flat()

  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? allReviewPhotos.length - 1 : prev - 1,
    )
  }

  const handleNext = () => {
    setCurrentSlide((prev) =>
      prev === allReviewPhotos.length - 1 ? 0 : prev + 1,
    )
  }

  if (allReviewPhotos.length === 0) {
    return null
  }

  return (
    <div style={{ position: 'relative' }}>
      <Carousel
        selectedItem={currentSlide}
        onChange={setCurrentSlide}
        onClickItem={(idx) => {
          const [reviewIndex, photoIndex] = lightboxIndices[idx]
          dispatch(openLightbox({ reviewIndex, photoIndex }))
        }}
        showIndicators={allReviewPhotos.length > 1}
      >
        {allReviewPhotos.map((photo) => (
          <img key={photo.id} src={photo.medium} alt="entry" />
        ))}
      </Carousel>
      {allReviewPhotos.length > 1 && (
        <>
          <LeftDot onClick={handlePrev} />
          <RightDot onClick={handleNext} />
        </>
      )}
    </div>
  )
}

export default EntryCarousel
