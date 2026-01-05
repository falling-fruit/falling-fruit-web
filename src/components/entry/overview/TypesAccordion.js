import '@reach/accordion/styles.css'

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  useAccordionItemContext,
} from '@reach/accordion'
import { DownArrow, UpArrow } from '@styled-icons/boxicons-solid'
import styled from 'styled-components/macro'

import { theme } from '../../ui/GlobalStyle'

const IndicatorAccordionButton = styled(AccordionButton)`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  border: none;
  width: 100%;
  background: ${({ theme }) => theme.background};
  text-align: left;
  font-family: ${({ theme }) => theme.fonts};

  :focus {
    outline: none;
  }
`

const TypesAccordionItem = styled(AccordionItem)`
  margin-block-end: 15px;
`

const TypesAccordionPanel = styled(AccordionPanel)`
  padding-block-start: 12px;
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
