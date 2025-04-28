import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { Cog } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'

const StyledSettingsButton = styled.button`
  cursor: pointer;
  padding: 5px 0;
  border: none;
  border-block-start: 1px solid ${({ theme }) => theme.secondaryBackground};
  position: sticky;
  inset-block-end: 0;
  inset-inline: 0;
  min-height: 3.5em;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
`

const PrimaryText = styled.div`
  font-weight: bold;
  font-family: ${({ theme }) => theme.fonts};
  color: ${({ theme }) => theme.headerText};
`

const SettingsCircleIcon = styled(Cog)`
  width: 1.75em;
  margin-inline-start: 1.5em;
  margin-inline-end: 1em;
`

const ChevronIcon = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: end;
  align-items: end;
  margin-inline-end: 1em;
  margin-inline-start: 0;
`

const SettingsButton = ({ onClick }) => {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const ChevronComponent = isRTL ? ChevronLeft : ChevronRight

  return (
    <StyledSettingsButton onClick={onClick}>
      <SettingsCircleIcon color={theme.orange} />
      <PrimaryText>{t('menu.settings')}</PrimaryText>
      <ChevronIcon>
        <ChevronComponent width="1.75em" color={theme.orange} />
      </ChevronIcon>
    </StyledSettingsButton>
  )
}

export default SettingsButton
