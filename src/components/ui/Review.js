import styled from 'styled-components/macro'

import Rating from './Rating'

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
const Review = ({ ratings, description, date, name }) => (
  <ReviewContainer>
    <RatingTable>
      {ratings.map(
        (rating, key) =>
          rating.percentage && (
            <tr key={key}>
              <td>
                <Label>{rating.label}</Label>
              </td>
              <td>
                <Rating key={key} percentage={rating.percentage} />
              </td>
            </tr>
          ),
      )}
    </RatingTable>
    <ReviewDescription>
      <blockquote>{description}</blockquote>
      {/* Include the images */}
      <cite>
        Reviewed {date} by {name}
      </cite>
    </ReviewDescription>
  </ReviewContainer>
)

export default Review
