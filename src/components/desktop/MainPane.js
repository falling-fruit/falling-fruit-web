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

const MainPane = () => (
  <StyledContainer>
    <SearchOverlay />
    <PagedList />
    <SettingsAccordion>
      <AccordionItem>
        <SettingsAccordionButton LeftIcon={Cog} text="Settings" />
      </AccordionItem>
    </SettingsAccordion>
  </StyledContainer>
)

export default MainPane
