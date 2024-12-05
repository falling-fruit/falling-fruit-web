import { Star as StarEmpty } from '@styled-icons/boxicons-regular'
import { Star, StarHalf } from '@styled-icons/boxicons-solid'
import { groupBy, prop as rProp } from 'ramda'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { formatMonth } from './textFormatters'

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
  const { t, i18n } = useTranslation()
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
          {t(`locations.infowindow.fruiting.${reviews[0].fruiting}`)}:{' '}
          {reviewMonthPairs
            .map(
              ([month, count]) =>
                `${formatMonth(month, i18n.language)} (${count})`,
            )
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
  const qualityScores = reviews.reduce((scores, review) => {
    if (review.quality_rating) {
      return [...scores, review.quality_rating]
    }
    return scores
  }, [])

  const yieldScores = reviews.reduce((scores, review) => {
    if (review.yield_rating) {
      return [...scores, review.yield_rating]
    }
    return scores
  }, [])

  return (
    <SummaryTable>
      <h3>Summary</h3>
      <tbody>
        <FruitingSummary reviews={reviews} />
        <SummaryRow title="Quality" scores={qualityScores} total={5} />
        <SummaryRow title="Yield" scores={yieldScores} total={5} />
      </tbody>
    </SummaryTable>
  )
}

export default ReviewSummary
