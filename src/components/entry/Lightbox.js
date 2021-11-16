/* eslint-disable jsx-a11y/alt-text */
import { Dialog } from '@reach/dialog'
import styled from 'styled-components/macro'

import Button from '../ui/Button'
import Review from './Review'

const StyledDialog = styled(Dialog)`
  display: flex;
  min-height: fit-content;
  min-width: fit-content;
`

const Lightbox = ({
  onDismiss,
  review,
  currImgIndex,
  setCurrImgIndex,
  reviewImages,
}) => {
  console.log(onDismiss)

  return (
    <StyledDialog onDismiss={onDismiss}>
      <img src={reviewImages[currImgIndex].medium} />
      {console.log(reviewImages)}
      <Review review={review} />
      {currImgIndex - 1 >= 0 && (
        <Button onClick={() => setCurrImgIndex(currImgIndex - 1)}>left</Button>
      )}
      {currImgIndex + 1 < reviewImages.length && (
        <Button onClick={() => setCurrImgIndex(currImgIndex + 1)}>right</Button>
      )}
      {currImgIndex}
    </StyledDialog>
  )
}

export default Lightbox
