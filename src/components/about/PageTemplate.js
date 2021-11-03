import styled from 'styled-components/macro'

const PageScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  height: 100%;
`

const PageTemplate = styled.article`
  @media ${({ theme }) => theme.device.mobile} {
    width: 80%;
  }

  max-width: 950px;
  width: 66%;
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
    color: ${({ theme }) => theme.secondaryText};
  }

  h3 {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: bold;
    font-size: 1.429rem;
  }

  p {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.5;
  }

  a {
    color: ${({ theme }) => theme.orange};
    font-weight: normal;
    font-size: 1rem;
    line-height: 24px;
  }

  img {
    margin-right: 16px;
  }

  .logo {
    width: 150px;
    height: 150px;
  }

  .content {
    display: inline-flex;
    align-items: flex-start;
    margin-top: 10px;
    p {
      margin: 0;
    }
  }
`
export { PageScrollWrapper, PageTemplate }
