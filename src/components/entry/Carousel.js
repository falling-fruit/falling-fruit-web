import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import styled from 'styled-components/macro'

import { theme } from '../../components/ui/GlobalStyle'
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

    @media (max-width: ${theme.device.mobile}) {
      height: 200px; /* Slightly smaller on mobile */
    }
  }

  /* Control dots styling */
  .control-dots {
    display: flex;
    justify-content: flex-end; /* Align dots to the right */
    padding: 0 15px;
    margin-top: 10px;
    width: auto;
    inset-inline-end: 0;

    @media (max-width: ${theme.device.mobile}) {
      /* Hide dots on mobile drawer open to reduce clutter */
      display: none;
    }

    .dot {
      height: 10px;
      width: 10px;
      opacity: 1;
      margin: 0 8px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
      background: ${theme.secondaryBackground};
      border-radius: 50%;
      transition:
        background-color 0.3s,
        transform 0.3s;

      &.selected {
        background: ${theme.orange};
        transform: scale(1.3);
        box-shadow: 0 0 8px ${theme.orange};
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

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  padding: 6px;
  z-index: 20;
  cursor: pointer;
  transition:
    background 0.3s,
    box-shadow 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  @media (min-width: ${theme.device.desktop}) {
    display: none;
  }

  &:hover,
  &:focus {
    background: ${theme.blue};
    box-shadow: 0 0 8px ${theme.blue};
    outline: none;
  }

  i {
    display: block;
    font-size: 22px;
    color: ${theme.secondaryText};
  }
`

const BackArrow = styled(ArrowButton)`
  inset-inline-start: 12px;

  @media (max-width: ${theme.device.mobile}) {
    width: 44px;
    height: 44px;
    padding: 8px;
  }
`

const ForwardArrow = styled(ArrowButton)`
  inset-inline-end: 12px;

  @media (max-width: ${theme.device.mobile}) {
    width: 44px;
    height: 44px;
    padding: 8px;
  }
`

const EntryCarousel = () => {
  const dispatch = useDispatch()
  const { reviews } = useSelector((state) => state.location)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Filter only reviews with photos
  const reviewsWithPhotos = reviews.filter((review) => review.photos.length > 0)

  // Flatten photo indices for lightbox
  const lightboxIndices = reviewsWithPhotos
    .map((review, ri) => review.photos.map((_, pi) => [ri, pi]))
    .flat()

  const allReviewPhotos = reviewsWithPhotos
    .map((review) => review.photos)
    .flat()

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentSlide < allReviewPhotos.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    }
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
          {currentSlide > 0 && (
            <BackArrow onClick={handlePrev} aria-label="Previous photo">
              <i className="bx bx-chevron-left" />
            </BackArrow>
          )}
          {currentSlide < allReviewPhotos.length - 1 && (
            <ForwardArrow onClick={handleNext} aria-label="Next photo">
              <i className="bx bx-chevron-right" />
            </ForwardArrow>
          )}
        </>
      )}
    </div>
  )
}

export default EntryCarousel
