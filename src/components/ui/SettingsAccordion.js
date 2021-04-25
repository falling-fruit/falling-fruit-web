import '@reach/accordion/styles.css'

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  useAccordionItemContext,
} from '@reach/accordion'
import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import ListEntry from '../list/ListEntry'
import CircleIcon from '../ui/CircleIcon'
import { theme } from './GlobalStyle'
import IndicatorAccordionButton from './IndicatorAccordionButton'

const StyledListEntry = styled(ListEntry)`
  width: 100%;

  .primaryText {
    font-size: 15px;
    font-weight: 700;
  }
`

const SettingsAccordionButton = ({ LeftIcon, text, ...props }) => {
  const { isExpanded } = useAccordionItemContext()
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight

  return (
    <IndicatorAccordionButton {...props}>
      <StyledListEntry
        leftIcons={
          <CircleIcon backgroundColor={theme.transparentOrange}>
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
