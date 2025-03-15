import { ChevronRight } from '@styled-icons/boxicons-regular'
import { Cog } from '@styled-icons/boxicons-solid'
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

const SettingsCircleIcon = styled(Cog)`
  margin-left: 1.5em;
  margin-right: 1em;
  width: 1.75em;
`

export const ChevronIcon = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: right;
  align-items: right;
  margin-right: 1em;
`

const SettingsButton = ({ text, onClick }) => (
  <StyledSettingsButton onClick={onClick}>
    <SettingsCircleIcon color={theme.orange} />
    <PrimaryText>{text}</PrimaryText>
    <ChevronIcon>
      <ChevronRight width="1.75em" color={theme.orange} />
    </ChevronIcon>
  </StyledSettingsButton>
)

export default SettingsButton
