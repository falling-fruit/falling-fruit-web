import styled from 'styled-components/macro'

const Title = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.tertiaryText};
`
const Bar = styled.div`
  height: 5px;
  background: #c4c4c4;
  margin: 0 12px;
  border-radius: 9px;

  ${'' /* TODO: Change background to style before requesting review */}
`
const Score = styled.div`
  height: 5px;
  z-index: 1;
  width: ${(props) => props.score}%;
  border-radius: 9px;
  background: #73cd7c;
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`

const Rating = ({ title, score }) => (
  <RatingContainer>
    <Title>{title}</Title>
    <Bar>
      <Score score={score} />
    </Bar>
  </RatingContainer>
)

export default Rating
