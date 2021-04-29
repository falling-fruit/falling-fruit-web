import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getReviews } from '../../utils/api'
import Review from '../ui/Review'
import { Page, TextContent } from './EntryTabs'
import { formatISOString } from './textFormatters'

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
          reviewData.map((review, key) => (
            <Review
              key={key}
              ratings={[
                {
                  label: 'Fruiting',
                  percentage: review.fruiting && review.fruiting / 3,
                },
                {
                  label: 'Quality',
                  percentage:
                    review.quality_rating && review.quality_rating / 5,
                },
                {
                  label: 'Yield',
                  percentage: review.yield_rating && review.yield_rating / 5,
                },
              ]}
              description={review.comment}
              date={formatISOString(review.created_at)}
              name={review.author}
            />
          ))}
      </TextContent>
    </Page>
  )
}

export default EntryReviews
