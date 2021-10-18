import styled from 'styled-components/macro'

const PageTemplate = styled.article`
  @media ${({ theme }) => theme.device.mobile} {
    width: 80%;
  }

  max-width: 950px;
  width: 66%;
  overflow-y: scroll;
  height: inherit;
  margin: 56px auto 0px;
  overflow-wrap: break-word;
  h1 {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    color: ${({ theme }) => theme.secondaryText};
  }

  h2 {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 31px;
    color: ${({ theme }) => theme.secondaryText};
  }

  h3 {
    color: ${({ theme }) => theme.secondaryText};
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
  }

  p {
    color: ${({ theme }) => theme.secondaryText};
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
  }

  a {
    color: ${({ theme }) => theme.orange};
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 24px;
  }
`
export default PageTemplate
