import { ArrowBack } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useAppHistory } from '../../utils/useAppHistory'
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
  margin: 28px auto;
  overflow-wrap: break-word;
  font-family: ${({ theme }) => theme.fonts};
  font-style: normal;
  box-sizing: border-box;

  @media ${({ theme }) => theme.device.mobile} {
    width: 100%;
    padding: 0 23px 20px;
    margin: 28px auto 0 auto;
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
    margin-top: 10px;

    p {
      margin: 0;
    }

    @media ${({ theme }) => theme.device.desktop} {
      display: inline-flex;
      align-items: flex-start;
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
  svg {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.6em;
  }
`

const PageTemplate = ({ children, backToSettingsOnMobile }) => {
  const history = useAppHistory()
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    <PageTemplateWrapper>
      {backToSettingsOnMobile && isMobile && (
        <StyledBackButton onClick={() => history.push('/settings')}>
          <ArrowBack />
          {t('layouts.back')}
        </StyledBackButton>
      )}

      {children}
    </PageTemplateWrapper>
  )
}

export { PageScrollWrapper, PageTemplate }
