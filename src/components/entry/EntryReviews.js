import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { getReviews } from '../../utils/api'
import ImagePreview from '../ui/ImagePreview'
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
      <h2>Reviews</h2>
      {console.log('data', reviewData)}
      {reviewData &&
        reviewData.map((review, key) => <Review key={key} review={review} />)}
      {reviewData &&
        reviewData.map((review, key) => (
          <StyledImagePreview $small key={key}>
            <img src={review.photo.thumb} alt={review.title}></img>
          </StyledImagePreview>
        ))}
    </TextContent>
  )
}

export default EntryReviews
