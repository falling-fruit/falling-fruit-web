import styled from 'styled-components/macro'

const StyledLabeledInput = styled.div`
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
      font-size: 0.875rem;
      font-weight: bold;
      color: ${({ theme }) => theme.secondaryText};
      cursor: pointer;
      flex: 1;
    }
  }
`

// TODO: should language preferences be a grid instead of flex

const LabeledRow = ({ label, left, right, ...props }) => (
  <StyledLabeledInput {...props}>
    <div>
      {left}
      {label}
    </div>
    {right && <div>{right}</div>}
  </StyledLabeledInput>
)

export default LabeledRow
