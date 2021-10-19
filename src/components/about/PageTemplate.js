import styled from 'styled-components/macro'

const PageTemplate = styled.article`
  @media ${({ theme }) => theme.device.mobile} {
    width: 80%;
  }

  max-width: 950px;
  width: 66%;
  overflow-y: auto;
  height: inherit;
  margin: 56px auto 0px;
  overflow-wrap: break-word;
  font-family: Lato;
  font-style: normal;

  h1 {
    font-weight: bold;
    font-size: 2.286rem;
    color: ${({ theme }) => theme.secondaryText};
  }

  h2 {
    font-weight: bold;
    font-size: 1.857rem;
    line-height: 31px;
    color: ${({ theme }) => theme.secondaryText};
  }

  h3 {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: bold;
    font-size: 1.429rem;
    line-height: 24px;
  }

  p {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: normal;
    font-size: 1.429rem;
    line-height: 24px;
  }

  a {
    color: ${({ theme }) => theme.orange};
    font-weight: normal;
    font-size: 1.429rem;
    line-height: 24px;
  }
`
export default PageTemplate
