import { Star as StarEmpty } from '@styled-icons/boxicons-regular'
import { Star } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

const RatingWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  svg {
    width: 1.2em;
    height: 1.2em;
    color: ${({ theme }) => theme.orange};
  }
`

const Rating = ({ score, total }) => {
  const stars = new Array(total).fill(null).map((_, idx) => {
    if (idx + 1 > score) {
      return <StarEmpty key={idx} />
    }
    return <Star key={idx} />
  })

  return <RatingWrapper>{stars}</RatingWrapper>
}

export default Rating
