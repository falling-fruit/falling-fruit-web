import { Cog } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import PagedList from '../list/PagedList'
import {
  AccordionItem,
  SettingsAccordion,
  SettingsAccordionButton,
} from '../ui/SettingsAccordion'
import SearchOverlay from './SearchOverlay'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledSettingsAccordion = styled(SettingsAccordion)`
  padding: 10px 0 10px 0;
  border-top: 1px solid ${({ theme }) => theme.secondaryBackground};
`

const MainPane = () => (
  <StyledContainer>
    <SearchOverlay />
    <PagedList />
    <StyledSettingsAccordion>
      <AccordionItem>
        <SettingsAccordionButton LeftIcon={Cog} text="Settings" />
      </AccordionItem>
    </StyledSettingsAccordion>
  </StyledContainer>
)

export default MainPane
