import {
  HelpCircle as QuestionMark,
  Star as StarEmpty,
} from '@styled-icons/boxicons-regular'
import { Star, StarHalf } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import { RATINGS } from '../../constants/ratings'

const SummaryTable = styled.table`
  border-spacing: 0;
  width: 100%;
  margin-bottom: 2em;

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

  caption {
    text-align: left;
    margin-bottom: 1em;
    font-size: 1.125rem;
  }
`

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
    icon = <QuestionMark />
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
  const ratingsWithScores = RATINGS.map((rating) => ({
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
      <caption>Summary</caption>
      <tbody>
        {ratingsWithScores.map((rating) => (
          <SummaryRow key={rating.ratingKey} {...rating} />
        ))}
      </tbody>
    </SummaryTable>
  )
}

export default ReviewSummary
