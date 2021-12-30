import { Star as StarEmpty } from '@styled-icons/boxicons-regular'
import { Star, StarHalf } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import { RATINGS } from '../../constants/ratings'

const SummaryTable = styled.table`
  width: 100%;
  margin-bottom: 16px;
  font-size: 1.14rem;

  svg {
    width: 1.2em;
    margin: -0.3em 0 0 0.3em;
    color: ${({ theme }) => theme.orange};
  }

  td:nth-child(2) {
    text-align: right;
  }
`

const SummaryRow = ({ title, scores, total }) => {
  const aggregateScore = scores.reduce(add, 0) / scores.length
  const normalizedScore = aggregateScore / total

  let icon = <Star />

  if (normalizedScore <= 0.25) {
    icon = <StarEmpty />
  } else if (normalizedScore <= 0.5) {
    icon = <StarHalf />
  }

  return (
    <tr>
      <td>{title}</td>
      <td>
        {aggregateScore}
        <small>/{total}</small>
        {icon}
      </td>
    </tr>
  )
}

const add = (a, b) => a + b

const ReviewSummary = ({ reviews }) => {
  const ratingsWithScores = RATINGS.map((rating) => ({
    ...rating,
    scores: reviews
      .filter((review) => review[rating.ratingKey])
      .map((review) => review[rating.ratingKey]),
  }))

  return (
    <SummaryTable>
      <tbody>
        {ratingsWithScores.map((rating) => (
          <SummaryRow key={rating.ratingKey} {...rating} />
        ))}
      </tbody>
    </SummaryTable>
  )
}

export default ReviewSummary
