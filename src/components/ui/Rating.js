import styled from 'styled-components/macro'

const Title = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.tertiaryText};
`
const Bar = styled.div`
  height: 5px;
  background: #73cd7c;
  margin: 0 12px;
  border-radius: 9px;

  ${'' /* TODO: Change background to style before requesting review */}
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`

const Rating = ({ title }) => (
  <RatingContainer>
    <Title>{title}</Title>
    <Bar />
  </RatingContainer>
)

export default Rating
