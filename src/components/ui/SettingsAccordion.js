import '@reach/accordion/styles.css'

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  useAccordionItemContext,
} from '@reach/accordion'
import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import { Cog } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import CircleIcon from '../ui/CircleIcon'
import { theme } from './GlobalStyle'
import IndicatorAccordionButton from './IndicatorAccordionButton'
import ListEntry from './ListEntry'

const StyledListEntry = styled(ListEntry)`
  width: 100%;

  .primaryText {
    font-size: 0.9375rem;
    font-weight: bold;
  }
`

const SettingsAccordionButton = ({ LeftIcon = Cog, text, ...props }) => {
  const { isExpanded } = useAccordionItemContext()
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight

  return (
    <IndicatorAccordionButton {...props}>
      <StyledListEntry
        leftIcons={
          <CircleIcon>
            <LeftIcon color={theme.orange} />
          </CircleIcon>
        }
        primaryText={text}
        rightIcons={<ChevronIcon size="21" color={theme.orange} />}
      />
    </IndicatorAccordionButton>
  )
}

const SettingsAccordion = (props) => (
  <Accordion collapsible multiple {...props} />
)

export {
  AccordionItem,
  AccordionPanel,
  SettingsAccordion,
  SettingsAccordionButton,
}
