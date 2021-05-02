import styled from 'styled-components/macro'

// TODO: Fix title vertical centering

const Bar = styled.div`
  height: 5px;
  background: ${({ theme }) => theme.secondaryBackground};
  margin: 0 12px;
  border-radius: 9px;
`
const Score = styled.div`
  height: 5px;
  width: ${(props) => props.percentage * 100}%;
  border-radius: 9px;
  background: ${(props) => getRatingBarColor(props.percentage)};
`

const getRatingBarColor = (percentage) => {
  if (percentage <= 0.33) {
    return ({ theme }) => theme.red
  } else if (percentage <= 0.66) {
    return ({ theme }) => theme.orange
  } else {
    return ({ theme }) => theme.green
  }
}

const Rating = ({ percentage }) => (
  <Bar>
    <Score percentage={percentage} />
  </Bar>
)

export default Rating
