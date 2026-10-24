import { Menu, X } from '@styled-icons/boxicons-regular'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { LanguageSelect } from '../../i18n'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { BackButton } from './ActionButtons'
import Button from './Button'
import ResetButton from './ResetButton'

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

const LandingTopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  img {
    height: 48px;
    width: auto;
    margin-inline-end: 0;
  }
`

const HamburgerButton = styled(ResetButton)`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.secondaryText};
`

const LandingMenuPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75em;
  width: 100%;
  margin-block-start: 1em;

  ${LanguageContainer} {
    margin-inline: 0 auto;
    max-width: 120px;
  }

  a {
    text-decoration: none;
  }
`

const MenuAuthActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75em;
`

const MenuLinkWhite = styled(Link)`
  color: ${({ theme }) => theme.background} !important;
`

const PageScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;

  #root.auto-height & {
    overflow-y: visible;
  }
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

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.background};
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
    padding-block: 0 calc(30px + var(--safe-area-inset-bottom, 0px));
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

const InfoPageWrapper = styled(PageWrapper)`
  ${({ isDesktop }) =>
    !isDesktop &&
    `
    margin-block: 0;
  `}
`

const StyledBackButton = styled(BackButton)`
  padding-inline: 23px;
  padding-block: 1.5em;
`

const StickyBackHeader = ({ backPath, backState }) => (
  <StickyHeader>
    <SafeAreaInset />
    <StyledBackButton backPath={backPath} backState={backState} />
  </StickyHeader>
)

const NoTopMarginPageWrapper = styled(PageWrapper)`
  ${({ isDesktop }) =>
    !isDesktop &&
    `
    margin-block: 0;
  `}
`

const InlineBackButton = styled(BackButton)`
  margin-block-end: 23px;
`

const Page = ({ children, backPath, showBackButton }) => {
  const isDesktop = useIsDesktop()
  const hasBackButton = showBackButton ?? backPath !== undefined

  const Wrapper =
    hasBackButton && !isDesktop ? NoTopMarginPageWrapper : PageWrapper

  return (
    <PageScrollWrapper>
      {hasBackButton && !isDesktop && <StickyBackHeader backPath={backPath} />}
      <Wrapper isDesktop={isDesktop}>
        {hasBackButton && isDesktop && <InlineBackButton backPath={backPath} />}
        {children}
      </Wrapper>
    </PageScrollWrapper>
  )
}

const NoTopMarginTopSafeAreaInsetPageWrapper = styled(
  TopSafeAreaInsetPageWrapper,
)`
  ${({ isDesktop }) =>
    !isDesktop &&
    `
    margin-block: 0;
  `}
`

const TopSafeAreaInsetPage = ({ children, backPath, showBackButton }) => {
  const isDesktop = useIsDesktop()
  const hasBackButton = showBackButton ?? backPath !== undefined
  const hasStickyBack = hasBackButton && !isDesktop

  const Wrapper = hasStickyBack
    ? NoTopMarginTopSafeAreaInsetPageWrapper
    : TopSafeAreaInsetPageWrapper

  return (
    <TopSafeAreaInsetPageScrollWrapper isDesktop={isDesktop}>
      {!isDesktop &&
        (hasStickyBack ? (
          <StickyBackHeader backPath={backPath} />
        ) : (
          <SafeAreaInset />
        ))}
      <Wrapper isDesktop={isDesktop}>
        {hasBackButton && isDesktop && <InlineBackButton backPath={backPath} />}
        {children}
      </Wrapper>
    </TopSafeAreaInsetPageScrollWrapper>
  )
}

const InfoPage = ({ children }) => {
  const isDesktop = useIsDesktop()

  const { user } = useSelector((state) => state.auth)
  return (
    <PageScrollWrapper>
      {!isDesktop && (
        <StickyBackHeader
          backPath={user ? '/account/edit' : '/about/welcome'}
          backState={{ scrollToBottom: true }}
        />
      )}
      <InfoPageWrapper isDesktop={isDesktop}>{children}</InfoPageWrapper>
    </PageScrollWrapper>
  )
}

const LimitedWidthContainer = styled.div`
  ${({ isDesktop }) =>
    isDesktop &&
    `
    max-width: 400px;
  `}
`

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
        <LimitedWidthContainer isDesktop={isDesktop}>
          {children}
        </LimitedWidthContainer>
      </TopSafeAreaInsetPageWrapper>
    </TopSafeAreaInsetPageScrollWrapper>
  )
}

const LandingPage = ({ children }) => {
  const isDesktop = useIsDesktop()
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <PageScrollWrapper>
      <PageWrapper isDesktop={isDesktop}>
        <LandingTopBar>
          <img src="/logo_orange.svg" alt="Falling Fruit logo" />
          <HamburgerButton
            className="hamburger"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={28} />}
          </HamburgerButton>
        </LandingTopBar>
        {isMenuOpen && (
          <LandingMenuPanel>
            <LanguageContainer>
              <LanguageSelect />
            </LanguageContainer>
            <MenuAuthActions>
              <Button type="button" secondary>
                <Link to="/auth/sign_in">{t('users.sign_in')}</Link>
              </Button>
              <Button type="button">
                <MenuLinkWhite to="/auth/sign_up">
                  {t('glossary.sign_up')}
                </MenuLinkWhite>
              </Button>
            </MenuAuthActions>
          </LandingMenuPanel>
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
