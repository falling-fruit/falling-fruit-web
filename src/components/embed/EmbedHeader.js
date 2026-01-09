import { LinkExternal, ListUl, Menu, X } from '@styled-icons/boxicons-regular'
import { Cog, FilterAlt, MapAlt } from '@styled-icons/boxicons-solid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import { EMBED_HEADER_HEIGHT_PX } from '../../constants/mobileLayout'
import { useAppHistory } from '../../utils/useAppHistory'
import useShareUrl from '../share/useShareUrl'
import { AddLocationEmbed } from '../ui/AddLocation'
import { zIndex } from '../ui/GlobalStyle'
import ResetButton from '../ui/ResetButton'
import { Tab, TabList, VerticalTabs } from './VerticalTabs'

const HeaderContainer = styled.div`
  position: absolute;
  z-index: ${zIndex.topBar + 1};
  display: flex;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-direction: column;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  height: ${EMBED_HEADER_HEIGHT_PX - 2 * 8}px;
  padding: 8px;
  gap: 8px;
`

const ExternalSiteLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: ${({ theme }) => theme.orange};
  margin-bottom: 1em;
  text-decoration: none;
  font-size: 1em;
  gap: 4px;

  &:hover {
    text-decoration: underline;
    background-color: ${({ theme }) => theme.secondaryBackground}10;
  }
`

const Logo = styled.img`
  height: 40px;
  margin-inline-end: 0.5em;
  cursor: pointer;
`

const EmbedHeader = () => {
  const history = useAppHistory()
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const shareUrl = useShareUrl()

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const tabPaths = ['/settings', '/map', '/list', '/filters']

  const findCurrentTabIndex = () => {
    const index = tabPaths.findIndex((path) => pathname.startsWith(path))
    return index !== -1 ? index : 0
  }

  const handleTabClick = (index) => {
    history.push(tabPaths[index])
    setIsExpanded(false)
  }

  return (
    <HeaderContainer isExpanded={isExpanded}>
      <HeaderContent>
        <ResetButton
          onClick={toggleMenu}
          aria-label={isExpanded ? 'Close menu' : 'Open menu'}
        >
          {isExpanded ? <X size={24} /> : <Menu size={24} />}
        </ResetButton>
        <Logo
          src="/logo_orange.svg"
          alt="Falling Fruit logo"
          onClick={() => window.open(shareUrl, '_blank', 'noopener,noreferrer')}
        />
      </HeaderContent>

      {isExpanded && (
        <>
          <VerticalTabs
            onChange={handleTabClick}
            defaultIndex={findCurrentTabIndex()}
          >
            <TabList>
              <Tab>
                <Cog size={20} />
                {t('menu.settings')}
              </Tab>
              <Tab>
                <MapAlt size={20} />
                {t('glossary.map')}
              </Tab>
              <Tab>
                <ListUl size={20} />
                {t('menu.list')}
              </Tab>
              <Tab>
                <FilterAlt size={20} />
                {t('menu.filters')}
              </Tab>
            </TabList>
          </VerticalTabs>
          <AddLocationEmbed style={{ marginTop: '1em' }} />
          <ExternalSiteLink
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkExternal size={16} />
            {t('share.leave_embed_view_for_full_site')}
          </ExternalSiteLink>
        </>
      )}
    </HeaderContainer>
  )
}

export default EmbedHeader
