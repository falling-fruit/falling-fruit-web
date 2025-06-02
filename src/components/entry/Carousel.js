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
  }

  .control-dots {
    display: flex;
    width: auto;
    inset-inline-end: 0;

    @media (max-width: ${theme.device.mobile}) {
      display: none;
    }

    .dot {
      height: 10px;
      width: 10px;
      opacity: 1;
      margin-inline: 0 10px;
      box-shadow: 0px 4px 4px ${theme.shadow};
      background: ${theme.secondaryBackground};

      &.selected {
        background: ${theme.orange};
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
  width: 32px;
  height: 32px;
  background: ${theme.secondaryBackground};
  border: none;
  border-radius: 50%;
  padding: 6px;
  z-index: 20;
  cursor: pointer;
  transition: background 0.3s;

  @media (min-width: ${theme.device.desktop}) {
    display: none;
  }

  &:hover {
    background: ${theme.blue};
  }

  i {
    display: block;
    font-size: 20px;
    color: ${theme.secondaryText};
  }
`

const BackArrow = styled(ArrowButton)`
  inset-inline-start: 10px;
`

const ForwardArrow = styled(ArrowButton)`
  inset-inline-end: 10px;
`

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
