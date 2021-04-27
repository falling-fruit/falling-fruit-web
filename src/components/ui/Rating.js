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
  background: ${(props) => props.color};
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`

const getRedToGreen = (percent) => {
  const r =
    percent < 50 ? 255 : Math.floor(255 - ((percent * 2 - 100) * 255) / 100)
  const g = percent > 50 ? 255 : Math.floor((percent * 2 * 255) / 100)
  return `rgb(${r},${g},120)`
}

const Rating = ({ title, score }) => (
  <RatingContainer>
    <Title>{title}</Title>
    <Bar>
      <Score score={score} color={getRedToGreen(score)} />
    </Bar>
  </RatingContainer>
)

export default Rating
