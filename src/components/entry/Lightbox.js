import { Dialog } from '@reach/dialog'
import { LeftArrowAlt, RightArrowAlt, X } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import ResetButton from '../ui/ResetButton'
import Review, { StyledImagePreview } from './Review'

const StyledDialog = styled(Dialog)`
  display: flex;
  width: 80%;
  max-width: fit-content;
`
//  TODO: Add media queries for mobile so that the layout of
//  has image on top and reviews on bottom?
const StyledReviewImage = styled.img`
  background-color: black;
  object-fit: contain;
  object-position: center;
  width: calc(35vw - 32px);
  min-width: 300px;
  height: 500px;
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
  reviewSubImgIndex,
  setCurrReviewIndex,
  setReviewSubImgIndex,
  reviewImages,
}) => {
  const incrementReviewImage = () => {
    reviewSubImgIndex + 1 < reviewImages[currReviewIndex].length
      ? setReviewSubImgIndex(reviewSubImgIndex + 1)
      : currReviewIndex + 1 < reviewImages.length
      ? (setCurrReviewIndex(currReviewIndex + 1), setReviewSubImgIndex(0))
      : (setCurrReviewIndex(0), setReviewSubImgIndex(0))
  }
  // TODO: Fix errors within this function (to test, spam back button)
  //   Will convert to ternary when working
  const decrementReviewImage = () => {
    if (reviewSubImgIndex - 1 < 0) {
      if (currReviewIndex - 1 < 0) {
        setCurrReviewIndex(reviewImages.length - 1)
        setReviewSubImgIndex(reviewImages[currReviewIndex].length)
      } else {
        console.log('before', currReviewIndex)
        setCurrReviewIndex(currReviewIndex - 1)
        // For some reason, the curr review index is the same in both cases
        // This occurs when moving from the first landscape pic back to the foraging pic
        console.log('after', currReviewIndex)
        setReviewSubImgIndex(reviewImages[currReviewIndex].length)
      }
    } else {
      setReviewSubImgIndex(reviewSubImgIndex - 1)
    }
  }
  return (
    <StyledDialog onDismiss={onDismiss}>
      <ImageContainer>
        <StyledReviewImage
          src={reviewImages[currReviewIndex][reviewSubImgIndex].medium}
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
        <Review review={review[currReviewIndex]} includePreview={false} />

        <ThumbnailImages>
          {reviewImages[currReviewIndex].map((photo) =>
            photo.thumb ===
            reviewImages[currReviewIndex][reviewSubImgIndex].thumb ? (
              <SelectedImagePreview $small key={photo.thumb}>
                <img src={photo.thumb} alt={review.title} />
              </SelectedImagePreview>
            ) : (
              <StyledImagePreview $small key={photo.thumb}>
                <img src={photo.thumb} alt={review.title} />
              </StyledImagePreview>
            ),
          )}
        </ThumbnailImages>
      </ReviewContainer>
    </StyledDialog>
  )
}

export default Lightbox
