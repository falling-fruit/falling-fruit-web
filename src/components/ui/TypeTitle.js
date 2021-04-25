import styled from 'styled-components/macro'

const StyledTypeTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts};

  h2 {
    font-size: ${({ small }) => (small ? 18 : 22.75)}px;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  h3 {
    margin-top: 0px;
    font-size: ${({ small }) => (small ? 14 : 16)}px;
    font-style: italic;
    color: ${({ theme }) => theme.text};
  }
`

const TypeTitle = ({ primaryText, secondaryText, small }) => (
  <StyledTypeTitle small={small}>
    <h2>{primaryText}</h2>
    <h3>{secondaryText}</h3>
  </StyledTypeTitle>
)

export default TypeTitle
