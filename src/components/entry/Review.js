import styled from 'styled-components/macro'

import ImagePreview from '../ui/ImagePreview'
import Rating from '../ui/Rating'
import { formatISOString } from './textFormatters'

const ReviewContainer = styled.div`
  margin-bottom: 20px;
`
const Label = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.tertiaryText};
  margin: 3px 0px;
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
  margin-bottom: 8px;
  blockquote {
    font-size: 1rem;
    color: ${({ theme }) => theme.secondaryText};
    margin: 0 0 4px 0;
  }
  cite {
    font-style: italic;
    font-size: 0.875rem;
  }
`
const StyledImagePreview = styled(ImagePreview)`
  margin-right: 7px;
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
      <tbody>
        {RATINGS.map(({ title, ratingKey, total }, key) =>
          review[ratingKey] ? (
            <tr key={key}>
              <td>
                <Label>{title}</Label>
              </td>
              <td>
                <Rating key={key} percentage={review[ratingKey] / total} />
              </td>
            </tr>
          ) : null,
        )}
      </tbody>
    </RatingTable>
    <ReviewDescription>
      <blockquote>{review.comment}</blockquote>
      <cite>
        Reviewed {formatISOString(review.created_at)} by{' '}
        {review.author ?? 'Anonymous'}
      </cite>
    </ReviewDescription>
    {review.photos.map((photo) => (
      <StyledImagePreview $small key={photo.thumb}>
        <img src={photo.thumb} alt={review.title} />
      </StyledImagePreview>
    ))}
  </ReviewContainer>
)

export default Review
