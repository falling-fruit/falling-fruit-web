import { Star as StarEmpty } from '@styled-icons/boxicons-regular'
import { Star, StarHalf } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.secondaryText};
  gap: 4px;

  svg {
    width: 1em;
    height: 1em;
    color: ${({ theme }) => theme.orange};
  }
`

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Separator = styled.span`
  margin: 0 0.5em;
  &::before {
    content: '·';
  }
`

export const getStarRating = (score) => {
  if (score === null) {
    return null
  }

  const stars = []
  const remainder = score % 1
  const fullStars = Math.floor(score) + 1

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} />)
    } else if (i === fullStars && remainder >= 0.25 && remainder <= 0.75) {
      stars.push(<StarHalf key={i} />)
    } else {
      stars.push(<StarEmpty key={i} />)
    }
  }

  return stars
}

const ReviewStats = ({ children }) => (
  <StatsContainer>{children}</StatsContainer>
)

export { Separator, StatsRow }
export default ReviewStats
