import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { getReviews } from '../../utils/api'
import ImagePreview from '../ui/ImagePreview'
import LoadingIndicator from '../ui/LoadingIndicator'
import { TextContent } from './EntryTabs'
import Review from './Review'

const StyledImagePreview = styled(ImagePreview)`
  margin-right: 7px;
`

const EntryReviews = () => {
  const [reviewData, setReviewData] = useState()
  const { id } = useParams()

  useEffect(() => {
    async function fetchReviewData() {
      const reviewData = await getReviews(id)
      setReviewData(reviewData)
    }
    fetchReviewData()
  }, [id])

  return (
    <TextContent>
      <h2>{`Reviews ${reviewData ? `(${reviewData.length})` : ''}`}</h2>
      {reviewData ? (
        reviewData.map((review, key) => (
          <div key={key}>
            <Review key={key} review={review} />
            <StyledImagePreview $small key={key}>
              <img src={review.photo.thumb} alt={review.title}></img>
            </StyledImagePreview>
          </div>
        ))
      ) : (
        <LoadingIndicator vertical cover />
        /* TODO: Center loading indicator correctly? */
      )}
    </TextContent>
  )
}

export default EntryReviews
