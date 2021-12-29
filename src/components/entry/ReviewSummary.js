import styled from 'styled-components/macro'

const SummaryTable = styled.table`
  width: 100%;
`

const add = (a, b) => a + b

const ReviewSummary = ({ reviews }) => {
  const fruitingReviews = reviews
    .filter((review) => review.fruiting)
    .map((review) => review.fruiting)
  const qualityReviews = reviews
    .filter((review) => review.quality_rating)
    .map((review) => review.quality_rating)
  const yieldReviews = reviews
    .filter((review) => review.yield_rating)
    .map((review) => review.yield_rating)

  console.log(fruitingReviews)

  return (
    <SummaryTable>
      <tr>
        <td>Fruiting</td>
        <td>{fruitingReviews.reduce(add, 0) / fruitingReviews.length}</td>
      </tr>
      <tr>
        <td>Quality</td>
        <td>{qualityReviews.reduce(add, 0) / qualityReviews.length}</td>
      </tr>
      <tr>
        <td>Yield</td>
        <td>{yieldReviews.reduce(add, 0) / yieldReviews.length}</td>
      </tr>
    </SummaryTable>
  )
}

export default ReviewSummary
