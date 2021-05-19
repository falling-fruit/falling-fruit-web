import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getReviews } from '../../utils/api'
import { ReviewForm } from '../form/ReviewForm'
import LoadingIndicator from '../ui/LoadingIndicator'
import { TextContent } from './EntryTabs'
import Review from './Review'

const EntryReviews = () => {
  const [reviews, setReviews] = useState()
  const { id } = useParams()

  useEffect(() => {
    async function fetchReviews() {
      const reviews = await getReviews(id)
      setReviews(reviews)
    }
    fetchReviews()
  }, [id])

  return (
    <TextContent>
      <h2>Reviews{reviews && ` (${reviews.length})`}</h2>
      {reviews ? (
        <>
          {reviews.map((review, index) => (
            <Review key={index} review={review} />
          ))}
          <ReviewForm />
        </>
      ) : (
        <LoadingIndicator vertical cover />
        /* TODO: Center loading indicator correctly? */
      )}
    </TextContent>
  )
}

export default EntryReviews
