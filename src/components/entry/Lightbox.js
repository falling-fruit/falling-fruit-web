/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dialog } from '@reach/dialog'
import { LeftArrowAlt, RightArrowAlt, X } from '@styled-icons/boxicons-regular'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import ResetButton from '../ui/ResetButton'
import Review from './Review'

const StyledDialog = styled(Dialog)`
  display: flex;
  width: 80%;
  max-width: 900px;
  border-radius: 12.5px;
  padding: 16px;
`
//  TODO: Fix lightbox behavior for mobile
const StyledReviewImage = styled.img`
  background-color: black;
  object-fit: contain;
  object-position: center;
  width: 100%;
  min-width: 300px;
  height: 500px;
  border-radius: 4px;
`
const ReviewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  padding-top: 50px;
  max-width: 300px;
  min-width: 300px;
`
const ThumbnailImage = styled(ImagePreview)`
  outline: ${(props) => props.selected && `3px solid ${props.theme.orange}`};
  border-radius: 3px;
  margin-right: 10px;
  img {
    border-radius: ${(props) => props.selected && '3px'};
    border: 0;
  }
`

const ThumbnailImageContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const NavButtonContainer = styled.div`
  position: absolute;
  bottom: 8px;
  right: 0px;
`

const ExitButton = styled(ResetButton)`
  position: absolute;
  top: 5px;
  right: 5px;
  color: ${({ theme }) => theme.secondaryText};
`

const ImageContainer = styled.div`
  position: relative;
  flex: 1;
`

const NavButton = styled(ResetButton)`
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  margin-right: 10px;
  background: rgba(0, 0, 0, 0.65);
  box-shadow: 0px 4px 4px ${({ theme }) => theme.shadow};

  &:disabled {
    color: grey;
  }
`
const Lightbox = ({ onDismiss, reviews, index, onIndexChange }) => {
  const reviewImages = reviews
    .filter((review) => review.photos.length > 0)
    .map((review) => review.photos)

  const incrementReviewImage = useCallback(() => {
    const [reviewIdx, imageIdx] = index
    if (imageIdx + 1 < reviewImages[reviewIdx].length) {
      onIndexChange([reviewIdx, imageIdx + 1])
    } else if (reviewIdx + 1 < reviewImages.length) {
      onIndexChange([reviewIdx + 1, 0])
    }
  }, [index, onIndexChange, reviewImages])

  const decrementReviewImage = useCallback(() => {
    const [reviewIdx, imageIdx] = index
    if (imageIdx === 0) {
      if (reviewIdx > 0) {
        onIndexChange([reviewIdx - 1, reviewImages[reviewIdx - 1].length - 1])
      }
    } else {
      onIndexChange([reviewIdx, imageIdx - 1])
    }
  }, [index, onIndexChange, reviewImages])

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
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return (
    <StyledDialog onDismiss={onDismiss}>
      <ImageContainer>
        <StyledReviewImage
          src={reviewImages[index[0]]?.[index[1]]?.original ?? ''}
        />
        {reviewImages.length > 1 && (
          <NavButtonContainer>
            <NavButton
              disabled={index[0] === 0 && index[1] === 0}
              onClick={decrementReviewImage}
            >
              <LeftArrowAlt size={30} />
            </NavButton>
            <NavButton
              disabled={
                index[0] === reviewImages.length - 1 &&
                index[1] === reviewImages[reviewImages.length - 1].length - 1
              }
              onClick={incrementReviewImage}
            >
              <RightArrowAlt size={30} />
            </NavButton>
          </NavButtonContainer>
        )}
      </ImageContainer>
      <ReviewContainer>
        <ExitButton onClick={onDismiss}>
          <X size={30} />
        </ExitButton>
        <Review review={reviews[index[0]]} includePreview={false} />

        <ThumbnailImageContainer>
          {reviewImages[index[0]].map((photo, idx) => (
            <ThumbnailImage
              small
              key={photo.thumb}
              selected={photo.thumb === reviewImages[index[0]][index[1]].thumb}
            >
              <img
                src={photo.thumb}
                alt={reviews.title}
                onClick={() => onIndexChange([index[0], idx])}
              />
            </ThumbnailImage>
          ))}
        </ThumbnailImageContainer>
      </ReviewContainer>
    </StyledDialog>
  )
}

export default Lightbox
