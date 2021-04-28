import styled from 'styled-components/macro'

// TODO: Look into Table / Grid
// TODO: Fix title vertical centering

const Label = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.tertiaryText};
  margin: 4px;
  flex-basis: 15%;
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
  width: ${(props) => props.percentage * 100}%;
  border-radius: 9px;
  background: ${(props) => getRedToGreen(props.percentage)};
`

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`

const getRedToGreen = (percentage) => {
  if (percentage <= 0.33) {
    return ({ theme }) => theme.red
  } else if (percentage <= 0.66) {
    return ({ theme }) => theme.orange
  } else {
    return ({ theme }) => theme.green
  }
}

const Rating = ({ label, percentage }) => (
  <RatingContainer>
    <Label>{label}</Label>
    <Bar>
      <Score percentage={percentage} />
    </Bar>
  </RatingContainer>
)

export default Rating
