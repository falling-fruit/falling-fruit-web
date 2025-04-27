import { ChevronLeft, ChevronRight } from '@styled-icons/boxicons-regular'
import { Cog } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { theme } from '../ui/GlobalStyle'

const StyledSettingsButton = styled.button`
  cursor: pointer;
  padding: 5px 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
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

const BaseSettingsCircleIcon = styled(Cog)`
  width: 1.75em;
`

const LTRSettingsCircleIcon = styled(BaseSettingsCircleIcon)`
  margin-left: 1.5em;
  margin-right: 1em;
`

const RTLSettingsCircleIcon = styled(BaseSettingsCircleIcon)`
  margin-left: 1em;
  margin-right: 1.5em;
`

const BaseChevronIcon = styled.div`
  flex: 1 1 0;
  display: flex;
`

export const LTRChevronIcon = styled(BaseChevronIcon)`
  justify-content: right;
  align-items: right;
  margin-right: 1em;
  margin-left: 0;
`

export const RTLChevronIcon = styled(BaseChevronIcon)`
  justify-content: left;
  align-items: left;
  margin-right: 0;
  margin-left: 1em;
`

const SettingsButton = ({ onClick }) => {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const SettingsCircleIcon = isRTL
    ? RTLSettingsCircleIcon
    : LTRSettingsCircleIcon
  const DirectionalChevronIcon = isRTL ? RTLChevronIcon : LTRChevronIcon
  const ChevronComponent = isRTL ? ChevronLeft : ChevronRight

  return (
    <StyledSettingsButton onClick={onClick}>
      <SettingsCircleIcon color={theme.orange} />
      <PrimaryText>{t('menu.settings')}</PrimaryText>
      <DirectionalChevronIcon>
        <ChevronComponent width="1.75em" color={theme.orange} />
      </DirectionalChevronIcon>
    </StyledSettingsButton>
  )
}

export default SettingsButton
