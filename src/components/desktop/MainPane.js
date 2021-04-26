import { Cog } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import {
  AccordionItem,
  SettingsAccordion,
  SettingsAccordionButton,
} from '../ui/SettingsAccordion'
import ListWrapper from './ListWrapper'
import SearchOverlay from './SearchOverlay'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const MainPane = () => (
  <StyledContainer>
    <SearchOverlay />
    <ListWrapper />
    <SettingsAccordion>
      <AccordionItem>
        <SettingsAccordionButton LeftIcon={Cog} text="Settings" />
      </AccordionItem>
    </SettingsAccordion>
  </StyledContainer>
)

export default MainPane
