import { Star as StarEmpty } from '@styled-icons/boxicons-regular'
import { Star, StarHalf } from '@styled-icons/boxicons-solid'
import { groupBy, prop as rProp } from 'ramda'
import styled from 'styled-components/macro'

import { FRUITING_RATINGS, RATINGS } from '../../constants/ratings'
import { MONTH_LABELS } from '../form/LocationForm'

const SummaryTable = styled.table`
  border-spacing: 0;
  width: 100%;
  margin-bottom: 1em;

  svg {
    width: 1.2em;
    height: 1.2em;
    margin: -0.3em 0 0 0.3em;
    color: ${({ theme }) => theme.orange};
  }

  tbody {
    line-height: 1.14;
  }

  td:nth-child(1) {
    font-size: 1rem;
    color: ${({ theme }) => theme.tertiaryText};
    margin: 3px 0;
  }

  td:nth-child(2) {
    font-size: 1.14rem;
    text-align: right;
  }

  td > p {
    margin-top: 0.5em;
    font-size: 1rem;
  }

  h3 {
    margin-top: 0;
  }
`

const FruitingSummaryRow = ({ reviews }) => {
  if (!reviews?.length) {
    return null
  }

  const reviewsByMonth = reviews.reduce((monthToCount, review) => {
    if (!review.observed_on) {
      return monthToCount
    }
    const month = new Date(review.observed_on).getMonth()

    monthToCount = {
      ...monthToCount,
      [month]: (monthToCount[month] || 0) + 1,
    }

    return monthToCount
  }, {})

  const reviewMonthPairs = Object.entries(reviewsByMonth)

  return (
    <tr>
      <td colSpan={2}>
        <p>
          {FRUITING_RATINGS[reviews[0].fruiting]}:{' '}
          {reviewMonthPairs
            .map(([month, count]) => `${MONTH_LABELS[month]} (${count})`)
            .join(', ')}
        </p>
      </td>
    </tr>
  )
}

const FruitingSummary = ({ reviews }) => {
  const {
    0: flowerReviews,
    1: unripeReviews,
    2: ripeReviews,
  } = groupBy(rProp('fruiting'), reviews)

  return (
    <>
      <tr>
        <td colSpan={2}>Fruiting</td>
      </tr>
      <FruitingSummaryRow reviews={flowerReviews} />
      <FruitingSummaryRow reviews={unripeReviews} />
      <FruitingSummaryRow reviews={ripeReviews} />
    </>
  )
}

const SummaryRow = ({ title, scores, total }) => {
  const aggregateScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const percentScore = aggregateScore / total

  let icon = <Star />

  if (percentScore <= 0.25) {
    icon = <StarEmpty />
  } else if (percentScore <= 0.5) {
    icon = <StarHalf />
  }

  if (Number.isNaN(percentScore)) {
    icon = null
  }

  return (
    <tr>
      <td>{title}</td>
      <td>
        {scores.length > 0 ? aggregateScore.toFixed(1) : <>&mdash;</>}
        <small>/{total}</small>
        {icon}
      </td>
    </tr>
  )
}

const ReviewSummary = ({ reviews }) => {
  const ratingsWithScores = RATINGS.slice(1).map((rating) => ({
    ...rating,
    scores: reviews.reduce((scores, review) => {
      if (review[rating.ratingKey]) {
        return [...scores, review[rating.ratingKey]]
      }
      return scores
    }, []),
  }))

  return (
    <SummaryTable>
      <h3>Summary</h3>
      <tbody>
        <FruitingSummary reviews={reviews} />
        {ratingsWithScores.map((rating) => (
          <SummaryRow key={rating.ratingKey} {...rating} />
        ))}
      </tbody>
    </SummaryTable>
  )
}

export default ReviewSummary
