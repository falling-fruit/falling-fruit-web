import '@reach/accordion/styles.css'

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  useAccordionItemContext,
} from '@reach/accordion'
import { DownArrow, UpArrow } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import { theme } from './GlobalStyle'
import IndicatorAccordionButton from './IndicatorAccordionButton'

const TypesAccordionItem = styled(AccordionItem)`
  margin-bottom: 15px;
`

const TypesAccordionPanel = styled(AccordionPanel)`
  padding-top: 12px;
`

const TypesAccordionButton = ({ children, ...props }) => {
  const { isExpanded } = useAccordionItemContext()
  const arrowIcon = isExpanded ? (
    <UpArrow size="21" color={theme.orange} />
  ) : (
    <DownArrow size="21" color={theme.secondaryBackground} />
  )

  return (
    <IndicatorAccordionButton {...props}>
      {children}
      {arrowIcon}
    </IndicatorAccordionButton>
  )
}

const TypesAccordion = (props) => <Accordion collapsible multiple {...props} />

export {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
}
