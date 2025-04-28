/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dialog } from '@reach/dialog'
import { LeftArrowAlt, RightArrowAlt, X } from '@styled-icons/boxicons-regular'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { closeLightbox, setLightboxIndices } from '../../redux/locationSlice'
import ImagePreview from '../ui/ImagePreview'
import ResetButton from '../ui/ResetButton'
import Review from './Review'

const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
  margin-block-start: 10vh;
  margin-block-end: 0;
  width: 90%;
  height: 80vh;
  border-radius: 0.375em;
  padding: 16px;
`

const StyledReviewImage = styled.img`
  background-color: black;
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: 50vh;
  border-radius: 0.375em;
`

const ReviewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-block-start: 24px;
  padding-block-start: 50px;
`

const ThumbnailImage = styled(ImagePreview)`
  outline: ${(props) => props.selected && `3px solid ${props.theme.orange}`};
  border-radius: 0.375em;
  margin-inline-end: 10px;
  margin-block-end: 10px;
  img {
    border-radius: ${(props) => props.selected && '0.375em'};
    border: 0;
  }
`

const ThumbnailImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NavButtonContainer = styled.div`
  position: absolute;
  inset-block-end: 8px;
  inset-inline-end: 0px;
`

const ExitButtonMobile = styled(ResetButton)`
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 50%;
  padding: 5px;
`

const ImageContainer = styled.div`
  position: relative;
`

const NavButton = styled(ResetButton)`
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 0.375em;
  margin-inline-end: 10px;
  background: rgba(0, 0, 0, 0.65);
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};

  &:disabled {
    color: grey;
  }
`
const Lightbox = () => {
  const dispatch = useDispatch()
  const { reviews, lightbox } = useSelector((state) => state.location)
  const { isOpen, reviewIndex, photoIndex } = lightbox

  const reviewImages = reviews
    .filter((review) => review.photos.length > 0)
    .map((review) => review.photos)

  const incrementReviewImage = useCallback(() => {
    if (photoIndex + 1 < reviewImages[reviewIndex].length) {
      dispatch(setLightboxIndices({ reviewIndex, photoIndex: photoIndex + 1 }))
    } else if (reviewIndex + 1 < reviewImages.length) {
      dispatch(
        setLightboxIndices({ reviewIndex: reviewIndex + 1, photoIndex: 0 }),
      )
    }
  }, [reviewIndex, photoIndex, dispatch, reviewImages])

  const decrementReviewImage = useCallback(() => {
    if (photoIndex === 0) {
      if (reviewIndex > 0) {
        dispatch(
          setLightboxIndices({
            reviewIndex: reviewIndex - 1,
            photoIndex: reviewImages[reviewIndex - 1].length - 1,
          }),
        )
      }
    } else {
      dispatch(setLightboxIndices({ reviewIndex, photoIndex: photoIndex - 1 }))
    }
  }, [reviewIndex, photoIndex, dispatch, reviewImages])

  const onKeyDown = useCallback(
    ({ key }) => {
      if (key === 'ArrowRight') {
        incrementReviewImage()
      } else if (key === 'ArrowLeft') {
        decrementReviewImage()
      }
    },
    [incrementReviewImage, decrementReviewImage],
  )
  useEffect(() => {
    if (!isOpen) {
      return
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <StyledDialog onDismiss={() => dispatch(closeLightbox())}>
      <ImageContainer>
        <ExitButtonMobile onClick={() => dispatch(closeLightbox())}>
          <X size={30} />
        </ExitButtonMobile>
        <StyledReviewImage
          src={reviewImages[reviewIndex]?.[photoIndex]?.original ?? ''}
        />
        {reviewImages.length > 1 && (
          <NavButtonContainer>
            <NavButton
              disabled={reviewIndex === 0 && photoIndex === 0}
              onClick={decrementReviewImage}
            >
              <LeftArrowAlt size={30} />
            </NavButton>
            <NavButton
              disabled={
                reviewIndex === reviewImages.length - 1 &&
                photoIndex === reviewImages[reviewImages.length - 1].length - 1
              }
              onClick={incrementReviewImage}
            >
              <RightArrowAlt size={30} />
            </NavButton>
          </NavButtonContainer>
        )}
      </ImageContainer>
      <ReviewContainer>
        <Review review={reviews[reviewIndex]} includePreview={false} />

        <ThumbnailImageContainer>
          {reviewImages[reviewIndex].map((photo, idx) => (
            <ThumbnailImage
              small
              key={photo.thumb}
              selected={
                photo.thumb === reviewImages[reviewIndex][photoIndex].thumb
              }
            >
              <img
                src={photo.thumb}
                alt={reviews.title}
                onClick={() =>
                  dispatch(setLightboxIndices({ reviewIndex, photoIndex: idx }))
                }
              />
            </ThumbnailImage>
          ))}
        </ThumbnailImageContainer>
      </ReviewContainer>
    </StyledDialog>
  )
}

export default Lightbox
