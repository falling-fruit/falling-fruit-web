import styled from 'styled-components/macro'

import Rating from './Rating'

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
    {ratings.map((rating, key) => (
      <Rating key={key} label={rating.label} percentage={rating.percentage} />
    ))}

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
