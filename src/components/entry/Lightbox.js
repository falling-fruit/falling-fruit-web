/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Dialog } from '@reach/dialog'
import { LeftArrowAlt, RightArrowAlt, X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import ResetButton from '../ui/ResetButton'
import Review, { StyledImagePreview } from './Review'

const StyledDialog = styled(Dialog)`
  display: flex;
  width: 80%;
  max-width: 900px;
  border-radius: 12.5px;
`
//  TODO: Add media queries for mobile so that the layout of
//  has image on top and reviews on bottom?
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
  max-width: 500px;
  min-width: 300px;
`
const ThumbnailImages = styled.div`
  display: flex;
  flex-direction: row;
`

const SelectedImagePreview = styled(ImagePreview)`
  margin-right: 7px;
  border: 5px solid ${({ theme }) => theme.orange};
  border-radius: 3px;
  img {
    border-radius: 0;
    border: 0;
    padding: 0;
  }
`
const NavButtonContainer = styled.div`
  position: absolute;
  bottom: 50px;
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
`

const Lightbox = ({
  onDismiss,
  review,
  currReviewIndex,
  setCurrReviewIndex,
  reviewImages,
}) => {
  const incrementReviewImage = () => {
    const i = currReviewIndex[0]
    const j = currReviewIndex[1]
    if (j + 1 < reviewImages[i].length) {
      setCurrReviewIndex([i, j + 1])
    } else {
      if (i + 1 < reviewImages.length) {
        setCurrReviewIndex([i + 1, 0])
      } else {
        setCurrReviewIndex([0, 0])
      }
    }
  }
  // TODO: Fix errors within this function (to test, spam back button)
  // TODO: use array to store indexes
  const decrementReviewImage = () => {
    const i = currReviewIndex[0]
    const j = currReviewIndex[1]
    if (j - 1 < 0) {
      if (i - 1 < 0) {
        setCurrReviewIndex([
          reviewImages.length - 1,
          reviewImages[reviewImages.length - 1].length - 1,
        ])
      } else {
        console.log('curr at', currReviewIndex[0], currReviewIndex[1])
        console.log('going to', i - 1, reviewImages[i - 1].length - 1)
        setCurrReviewIndex(i - 1, reviewImages[i - 1].length - 1)
        console.log('after change:', currReviewIndex)
      }
    } else {
      setCurrReviewIndex([i, j - 1])
    }
  }
  return (
    <StyledDialog onDismiss={onDismiss}>
      <ImageContainer>
        <StyledReviewImage
          src={reviewImages[currReviewIndex[0]][currReviewIndex[1]].medium}
        />
        <NavButtonContainer>
          <NavButton onClick={decrementReviewImage}>
            <LeftArrowAlt size={30} />
          </NavButton>
          <NavButton onClick={incrementReviewImage}>
            <RightArrowAlt size={30} />
          </NavButton>
        </NavButtonContainer>
      </ImageContainer>
      <ReviewContainer>
        <ExitButton onClick={onDismiss}>
          <X size={30} />
        </ExitButton>
        <Review review={review[currReviewIndex[0]]} includePreview={false} />

        <ThumbnailImages>
          {reviewImages[currReviewIndex[0]].map((photo, index) =>
            photo.thumb ===
            reviewImages[currReviewIndex[0]][currReviewIndex[1]].thumb ? (
              <SelectedImagePreview $small key={photo.thumb}>
                <img src={photo.thumb} alt={review.title} />
              </SelectedImagePreview>
            ) : (
              <StyledImagePreview $small key={photo.thumb}>
                {/* TODO: Fix linting error */}
                <img
                  src={photo.thumb}
                  alt={review.title}
                  onClick={() =>
                    setCurrReviewIndex([currReviewIndex[0], index])
                  }
                />
              </StyledImagePreview>
            ),
          )}
        </ThumbnailImages>
      </ReviewContainer>
    </StyledDialog>
  )
}

export default Lightbox
