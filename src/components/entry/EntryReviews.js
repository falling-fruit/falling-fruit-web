import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getReviews } from '../../utils/api'
import Review from '../ui/Review'
import { Page, TextContent } from './EntryTabs'

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
    <Page>
      <TextContent>
        <h2>Reviews</h2>

        {reviewData &&
          reviewData.map((review, key) => <Review key={key} review={review} />)}
      </TextContent>
    </Page>
  )
}

export default EntryReviews
