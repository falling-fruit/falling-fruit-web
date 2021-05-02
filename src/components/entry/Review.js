import styled from 'styled-components/macro'

import Rating from '../ui/Rating'
import { formatISOString } from './textFormatters'

const Label = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.tertiaryText};
  margin: 3px;
`
const RatingTable = styled.table`
  width: 100%;
  margin-bottom: 6px;
  border-spacing: 0;
  td:nth-child(2) {
    width: 100%;
  }
  td {
    padding: 0;
  }
`
const ReviewDescription = styled.section`
  blockquote {
    font-size: 16px;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0 0 4px 0;
  }
  cite {
    font-style: italic;
    font-size: 14px;
  }
`

const ReviewContainer = styled.div`
  height: 100%;
  overflow: auto;
  margin-bottom: 20px;
`

const RATINGS = [
  {
    title: 'Fruiting',
    ratingKey: 'fruiting',
    total: 3,
  },
  {
    title: 'Quality',
    ratingKey: 'quality_rating',
    total: 5,
  },
  {
    title: 'Yield',
    ratingKey: 'yield_rating',
    total: 5,
  },
]

const Review = ({ review }) => (
  <ReviewContainer>
    <RatingTable>
      {RATINGS.map(
        ({ title, ratingKey, total }, key) =>
          review[ratingKey] && (
            <tr key={key}>
              <td>
                <Label>{title}</Label>
              </td>
              <td>
                <Rating key={key} percentage={review[ratingKey] / total} />
              </td>
            </tr>
          ),
      )}
    </RatingTable>
    <ReviewDescription>
      <blockquote>{review.comment}</blockquote>
      <cite>
        Reviewed {formatISOString(review.created_at)} by {review.author}
      </cite>
    </ReviewDescription>
  </ReviewContainer>
)

export default Review
