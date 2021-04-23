import styled from 'styled-components/macro'

const StyledTypeTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts};

  h2 {
    font-size: 18px;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  small {
    font-size: 14px;
    font-style: italic;
    color: ${({ theme }) => theme.text};
  }
`

const TypeTitle = ({ primaryText, secondaryText }) => (
  <StyledTypeTitle>
    <h2>{primaryText}</h2>
    <small>{secondaryText}</small>
  </StyledTypeTitle>
)

export default TypeTitle
