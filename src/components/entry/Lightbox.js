/* eslint-disable jsx-a11y/alt-text */
import { Dialog } from '@reach/dialog'
import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import Review, { StyledImagePreview } from './Review'

const StyledDialog = styled(Dialog)`
  display: flex;
  min-height: max-content;
  min-width: fit-content;
`
const StyledReviewImage = styled.img`
  padding-right: 10px;
  object-fit: contain;
`
const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 300px;
`
const ThumbnailImages = styled.div`
  display: flex;
  flex-direction: row;
  max-height: min-content;
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
  top: 280px;
  right: 450px;
`

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.65);
  margin-right: 10px;

  color: white;
`

const Lightbox = ({
  onDismiss,
  review,
  currImgIndex,
  setCurrImgIndex,
  reviewImages,
}) => (
  <StyledDialog onDismiss={onDismiss}>
    <StyledReviewImage src={reviewImages[currImgIndex].medium} />
    <NavButtonContainer>
      <NavButton
        onClick={() =>
          setCurrImgIndex(
            currImgIndex - 1 >= 0 ? currImgIndex - 1 : reviewImages.length - 1,
          )
        }
      >
        {'<=='}
      </NavButton>

      <NavButton
        onClick={() =>
          setCurrImgIndex(
            currImgIndex + 1 < reviewImages.length ? currImgIndex + 1 : 0,
          )
        }
      >
        {'==>'}
      </NavButton>
    </NavButtonContainer>
    <ReviewContainer>
      <Review review={review} includePreview={false} />

      <ThumbnailImages>
        {reviewImages.map((photo) =>
          photo.thumb === reviewImages[currImgIndex].thumb ? (
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

export default Lightbox
