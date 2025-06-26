import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { LanguageSelect } from '../../i18n'
import { useAppHistory } from '../../utils/useAppHistory'
import { useIsMobile } from '../../utils/useBreakpoint'
import BackButton from '../ui/BackButton'
import ReturnIcon from './ReturnIcon'

const MobileHeader = styled.div`
  width: 100%;
  text-align: center;

  img {
    height: 10vh;
    width: auto;
  }
`

const LanguageContainer = styled.div`
  margin-inline-start: auto;
  max-width: 120px;
  text-align: start;
`

const PageScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
`

const PageWrapper = styled.article`
  max-width: 950px;
  width: 66%;
  height: inherit;
  margin: 28px auto;
  overflow-wrap: break-word;
  font-family: ${({ theme }) => theme.fonts};
  font-style: normal;
  box-sizing: border-box;

  @media ${({ theme }) => theme.device.mobile} {
    width: 100%;
    padding-block: 0 20px;
    padding-inline: 23px;
    margin-block: 28px 0;
    margin-inline: auto;
  }

  h1,
  h2,
  h3 {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: bold;
  }

  h1 {
    margin-block-start: 0.5em;
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
    margin-inline-end: 16px;
  }

  .logo {
    width: 150px;
    height: 150px;
  }

  .content {
    margin-block-start: 10px;

    p {
      margin: 0;
    }

    @media ${({ theme }) => theme.device.desktop} {
      display: inline-flex;
      align-items: start;
    }

    @media ${({ theme }) => theme.device.mobile} {
      overflow: hidden;
      margin-block-start: 20px;

      img {
        max-width: 100%;
        height: auto;
        float: left;
        clear: left;
        margin-block-end: 10px;
      }
    }

    &::after {
      content: '';
      display: table;
      clear: both;
    }
  }
`

const StyledBackButton = styled(BackButton)`
  margin-block-end: 23px;
  svg {
    width: 1.2em;
    height: 1.2em;
    margin-inline-end: 0.6em;
  }
`

const Page = ({ children }) => (
  <PageScrollWrapper>
    <PageWrapper>{children}</PageWrapper>
  </PageScrollWrapper>
)

const InfoPage = ({ children }) => {
  const history = useAppHistory()
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    <PageScrollWrapper>
      <PageWrapper>
        {isMobile && (
          <StyledBackButton onClick={() => history.push('/')}>
            <ReturnIcon />
            {t('layouts.back')}
          </StyledBackButton>
        )}

        {children}
      </PageWrapper>
    </PageScrollWrapper>
  )
}

const AuthPage = ({ children }) => {
  const isMobile = useIsMobile()

  return (
    <PageScrollWrapper>
      <PageWrapper>
        {isMobile && (
          <MobileHeader>
            <img src="/logo_orange.svg" alt="Falling Fruit logo" />
          </MobileHeader>
        )}
        {isMobile && (
          <LanguageContainer>
            <LanguageSelect />
          </LanguageContainer>
        )}
        {children}
      </PageWrapper>
    </PageScrollWrapper>
  )
}

export { AuthPage, InfoPage, Page }
