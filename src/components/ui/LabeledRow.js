import styled from 'styled-components/macro'

const StyledLabeledInput = styled.div`
  // can labels pass styling on to descendents like this? or should i be doing & > * or something or is that the same thing
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    flex: 1;

    &:first-child {
      display: flex;
      align-items: center;
    }

    > label {
      font-size: 14px;
      font-weight: bold;
      color: ${({ theme }) => theme.secondaryText};
    }
  }
`

// TODO: should language preferences be a grid instead of flex

const LabeledRow = ({ label, left, right }) => (
  <StyledLabeledInput>
    <div>
      {left}
      {label}
    </div>
    {right && <div>{right}</div>}
  </StyledLabeledInput>
)

export default LabeledRow
