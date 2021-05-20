import styled from 'styled-components/macro'

const StyledTypeTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts};

  h2 {
    font-size: 1.125rem;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  h3 {
    font-size: 0.875rem;
    font-style: italic;
    color: ${({ theme }) => theme.text};
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: normal;
  }
`

const TypeTitle = ({ primaryText, secondaryText }) => (
  <StyledTypeTitle>
    <h2>{primaryText}</h2>
    <h3>{secondaryText}</h3>
  </StyledTypeTitle>
)

export default TypeTitle
