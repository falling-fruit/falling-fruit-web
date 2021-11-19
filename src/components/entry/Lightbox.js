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
  /* max-width: 600px;
  max-height: 500px; */
  width: 600px;
  height: 500px;
  object-fit: contain;
  object-position: center;
  background-color: black;
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
  bottom: 0px;
  right: 0px;
`

const ImageContainer = styled.div`
  position: relative;
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
  subImgIndex,
  setCurrImgIndex,
  setSubImgIndex,
  reviewImages,
}) => {
  const nextImage = () => {
    subImgIndex + 1 < reviewImages[currImgIndex].length
      ? setSubImgIndex(subImgIndex + 1)
      : currImgIndex + 1 < reviewImages.length
      ? (setCurrImgIndex(currImgIndex + 1), setSubImgIndex(0))
      : (setCurrImgIndex(0), setSubImgIndex(0))
  }
  return (
    <StyledDialog onDismiss={onDismiss}>
      <ImageContainer>
        <StyledReviewImage
          src={reviewImages[currImgIndex][subImgIndex].medium}
        />
        <NavButtonContainer>
          <NavButton
            onClick={() => console.log('left')}

            //     subImgIndex + 1 > reviewImages[currImgIndex].length
            //       ? currImgIndex + 1 > reviewImages.length
            //         ? (setCurrImgIndex(0), setSubImgIndex(0))
            //         : (setCurrImgIndex(currImgIndex + 1), setSubImgIndex(0))
            //       : setSubImgIndex(subImgIndex + 1)
            //   }
          >
            {'<=='}
          </NavButton>

          <NavButton onClick={nextImage}>{'==>'}</NavButton>
        </NavButtonContainer>
      </ImageContainer>
      <ReviewContainer>
        <Review review={review} includePreview={false} />

        <ThumbnailImages>
          {reviewImages[currImgIndex].map((photo) =>
            photo.thumb === reviewImages[currImgIndex][subImgIndex].thumb ? (
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
