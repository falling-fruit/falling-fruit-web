import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useIsMobile } from '../../utils/useBreakpoint'
import BackButton from '../ui/BackButton'

const PageScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
`

const PageTemplateWrapper = styled.article`
  max-width: 950px;
  width: 66%;
  height: inherit;
  margin: 56px auto;
  overflow-wrap: break-word;
  font-family: ${({ theme }) => theme.fonts};
  font-style: normal;
  box-sizing: border-box;

  @media ${({ theme }) => theme.device.mobile} {
    width: 100%;
    padding: 56px 23px 20px;
  }

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

const StyledBackButton = styled(BackButton)`
  margin-bottom: 23px;
  svg {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.6em;
  }
`

const PageTemplate = ({ children }) => {
  // TODO: migrate to custom hook for map state
  const history = useHistory()
  const isMobile = useIsMobile()

  const onClickBackButton = () => history.go(-1)

  return (
    <PageTemplateWrapper>
      {isMobile && (
        <StyledBackButton onClick={onClickBackButton}>
          <ArrowBack />
          Back to Settings
        </StyledBackButton>
      )}

      {children}
    </PageTemplateWrapper>
  )
}

export { PageScrollWrapper, PageTemplate }
