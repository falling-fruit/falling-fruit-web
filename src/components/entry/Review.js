import styled from 'styled-components/macro'

import Rating from '../ui/Rating'
import { formatISOString } from './textFormatters'

const Label = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.tertiaryText};
  margin: 4px;
`
const RatingTable = styled.table`
  width: 100%;
  margin-bottom: 6px;

  td:nth-child(2) {
    width: 100%;
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
  margin-bottom: 20px;
`

const RATINGS = [
  {
    title: 'Fruiting',
    urlKey: 'fruiting',
    total: 3,
  },
  {
    title: 'Quality',
    urlKey: 'quality_rating',
    total: 5,
  },
  {
    title: 'Yield',
    urlKey: 'yield_rating',
    total: 5,
  },
]

const Review = ({ review }) => (
  <ReviewContainer>
    <RatingTable>
      {RATINGS.map(
        ({ title, urlKey, total }, key) =>
          review[urlKey] && (
            <tr key={key}>
              <td>
                <Label>{title}</Label>
              </td>
              <td>
                <Rating
                  key={key}
                  percentage={
                    title === 'Fruiting'
                      ? review[urlKey] / total
                      : review[urlKey] / total
                  }
                />
              </td>
            </tr>
          ),
      )}
    </RatingTable>
    <ReviewDescription>
      <blockquote>{review.comment}</blockquote>
      {/* Include the images */}
      <cite>
        Reviewed {formatISOString(review.created_at)} by {review.author}
      </cite>
    </ReviewDescription>
  </ReviewContainer>
)

export default Review
