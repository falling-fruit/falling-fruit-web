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
    max-width: 150px;
  }
`

const LanguageContainer = styled.div`
  margin-left: auto;
  max-width: 120px;
  text-align: start;
`

const PageScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

const PageWrapper = styled.article`
  max-width: 950px;
  width: 66%;
  min-height: 100vh;
  margin: 28px auto;
  overflow-wrap: break-word;
  font-family: ${({ theme }) => theme.fonts};
  font-style: normal;
  box-sizing: border-box;
  padding-bottom: 50px;

  @media ${({ theme }) => theme.device.mobile} {
    width: 100%;
    padding: 0 20px 40px 20px;
    margin: 28px 0 0 0;
  }

  h1,
  h2,
  h3 {
    color: ${({ theme }) => theme.secondaryText};
    font-weight: 700;
    margin-top: 1em;
  }

  h1 {
    font-size: 2.3rem;
  }

  h2 {
    font-size: 1.85rem;
  }

  h3 {
    font-size: 1.45rem;
  }

  p,
  a {
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0.5em 0;
  }

  p {
    color: ${({ theme }) => theme.secondaryText};
  }

  a {
    color: ${({ theme }) => theme.orange};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover,
    &:focus {
      color: ${({ theme }) => theme.orangeDark};
      text-decoration: underline;
    }
  }

  img {
    margin-right: 16px;
    max-width: 100%;
    height: auto;
  }

  .logo {
    width: 150px;
    height: 150px;
  }

  .content {
    margin-top: 10px;

    p {
      margin: 0;
    }

    @media ${({ theme }) => theme.device.desktop} {
      display: flex;
      align-items: flex-start;
      gap: 20px;
    }

    @media ${({ theme }) => theme.device.mobile} {
      overflow: hidden;
      margin-top: 20px;

      img {
        max-width: 100%;
        height: auto;
        float: left;
        clear: left;
        margin-bottom: 10px;
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
  margin-bottom: 23px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.secondaryText};

  svg {
    width: 1.3em;
    height: 1.3em;
    margin-right: 0.6em;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.orange};
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
          <StyledBackButton onClick={() => history.push('/settings')}>
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
          <>
            <MobileHeader>
              <img src="/logo_orange.svg" alt="Falling Fruit logo" />
            </MobileHeader>
            <LanguageContainer>
              <LanguageSelect />
            </LanguageContainer>
          </>
        )}
        {children}
      </PageWrapper>
    </PageScrollWrapper>
  )
}

export { AuthPage, InfoPage, Page }
