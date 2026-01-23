import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { LanguageSelect } from '../../i18n'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { BackButton } from './ActionButtons'

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

const TopSafeAreaInsetPageScrollWrapper = styled(PageScrollWrapper)`
  ${({ isDesktop }) =>
    !isDesktop &&
    `
    background-color: ${({ theme }) => theme.secondaryBackground};
  `}
`

const SafeAreaInset = styled.div`
  width: 100%;
  height: env(safe-area-inset-top);
  background-color: ${({ theme }) => theme.secondaryBackground};
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

  ${({ isDesktop }) =>
    !isDesktop &&
    `
    width: 100%;
    padding-block: 0 20px;
    padding-inline: 23px;
    margin-block: calc(28px + env(safe-area-inset-top)) 0;
    margin-inline: auto;
  `}

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

    ${({ isDesktop }) =>
      isDesktop &&
      `
      display: inline-flex;
      align-items: start;
    `}

    ${({ isDesktop }) =>
      !isDesktop &&
      `
      overflow: hidden;
      margin-block-start: 20px;

      img {
        max-width: 100%;
        height: auto;
        float: left;
        clear: left;
        margin-block-end: 10px;
      }
    `}

    &::after {
      content: '';
      display: table;
      clear: both;
    }
  }
`

const TopSafeAreaInsetPageWrapper = styled(PageWrapper)`
  ${({ isDesktop }) =>
    !isDesktop &&
    `
    margin-block: 28px 0;
  `}
`

const StyledBackButton = styled(BackButton)`
  margin-block-end: 23px;
`

const Page = ({ children }) => {
  const isDesktop = useIsDesktop()

  return (
    <PageScrollWrapper>
      <PageWrapper isDesktop={isDesktop}>{children}</PageWrapper>
    </PageScrollWrapper>
  )
}

const TopSafeAreaInsetPage = ({ children }) => {
  const isDesktop = useIsDesktop()

  return (
    <TopSafeAreaInsetPageScrollWrapper isDesktop={isDesktop}>
      {!isDesktop && <SafeAreaInset />}
      <TopSafeAreaInsetPageWrapper isDesktop={isDesktop}>
        {children}
      </TopSafeAreaInsetPageWrapper>
    </TopSafeAreaInsetPageScrollWrapper>
  )
}

const InfoPage = ({ children }) => {
  const isDesktop = useIsDesktop()

  const { user } = useSelector((state) => state.auth)
  return (
    <PageScrollWrapper>
      <PageWrapper isDesktop={isDesktop}>
        {!isDesktop && (
          <StyledBackButton
            backPath={user ? '/account/edit' : '/about/welcome'}
          />
        )}

        {children}
      </PageWrapper>
    </PageScrollWrapper>
  )
}

const AuthPage = ({ children }) => {
  const isDesktop = useIsDesktop()

  return (
    <TopSafeAreaInsetPageScrollWrapper isDesktop={isDesktop}>
      {!isDesktop && <SafeAreaInset />}
      <TopSafeAreaInsetPageWrapper isDesktop={isDesktop}>
        {!isDesktop && (
          <MobileHeader>
            <img src="/logo_orange.svg" alt="Falling Fruit logo" />
          </MobileHeader>
        )}
        {!isDesktop && (
          <LanguageContainer>
            <LanguageSelect />
          </LanguageContainer>
        )}
        {children}
      </TopSafeAreaInsetPageWrapper>
    </TopSafeAreaInsetPageScrollWrapper>
  )
}

const LandingPage = ({ children }) => {
  const isDesktop = useIsDesktop()

  return (
    <PageScrollWrapper>
      <PageWrapper isDesktop={isDesktop}>
        {!isDesktop && (
          <MobileHeader>
            <img src="/logo_orange.svg" alt="Falling Fruit logo" />
          </MobileHeader>
        )}
        {!isDesktop && (
          <LanguageContainer>
            <LanguageSelect />
          </LanguageContainer>
        )}
        {children}
      </PageWrapper>
    </PageScrollWrapper>
  )
}

const ErrorPage = ({ children }) => {
  const isDesktop = useIsDesktop()

  return (
    <PageScrollWrapper>
      <PageWrapper isDesktop={isDesktop}>
        {!isDesktop && (
          <MobileHeader>
            <img src="/logo_orange.svg" alt="Falling Fruit logo" />
          </MobileHeader>
        )}
        {children}
      </PageWrapper>
    </PageScrollWrapper>
  )
}

export {
  AuthPage,
  ErrorPage,
  InfoPage,
  LandingPage,
  Page,
  TopSafeAreaInsetPage,
}
