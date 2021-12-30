import styled from 'styled-components/macro'

const PageScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
`

const PageTemplate = styled.article`
  @media ${({ theme }) => theme.device.mobile} {
    width: 100%;
    padding: 20px 23px;
  }

  max-width: 950px;
  width: 66%;
  height: inherit;
  margin: 56px auto;
  overflow-wrap: break-word;
  font-family: 'Lato', sans-serif;
  font-style: normal;
  box-sizing: border-box;

  h1,
  h2,
  h3 {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: bold;
  }

  h1 {
    font-size: 2.286rem;
  }

  h2 {
    font-size: 1.857rem;
  }

  h3 {
    font-size: 1.429rem;
  }

  a,
  p {
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.5;
  }

  p {
    color: ${({ theme }) => theme.secondaryText};
  }

  a {
    color: ${({ theme }) => theme.orange};
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
