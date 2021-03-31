import '@reach/accordion/styles.css'

import {
  Accordion,
  AccordionButton as ReachAccordionButton,
  AccordionItem,
  AccordionPanel,
  useAccordionItemContext,
} from '@reach/accordion'
import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from './GlobalStyle'
import ListEntry from './ListEntry'

const StyledListEntry = styled(ListEntry)`
  width: 100%;

  .primaryText {
    font-size: 15px;
    font-weight: 700;
  }
`

const StyledAccordionButton = styled(ReachAccordionButton)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
  background: white;
  border: none;
  text-align: left;
  width: 100%;
  font-family: ${({ theme }) => theme.fonts};
`

const AccordionButton = ({ LeftIcon, text, ...props }) => {
  const { isExpanded } = useAccordionItemContext()
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight

  return (
    <StyledAccordionButton {...props}>
      <StyledListEntry
        leftIcons={
          <CircleIcon backgroundColor={theme.transparentOrange}>
            <LeftIcon color={theme.orange} />
          </CircleIcon>
        }
        primaryText={text}
        rightIcons={<ChevronIcon size="21" color={theme.orange} />}
      />
    </StyledAccordionButton>
  )
}

const SettingsAccordion = (props) => (
  <Accordion collapsible multiple {...props} />
)

export { AccordionButton, AccordionItem, AccordionPanel, SettingsAccordion }
