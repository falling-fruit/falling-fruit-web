import '@reach/accordion/styles.css'

import { AccordionButton } from '@reach/accordion'
import { ChevronDown, ChevronLeft } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components'

import ListEntry from './ListEntry'

//TODO: get rid of li from wrapping ListEntry

const StyledListEntry = styled(ListEntry)`
  font-family: Lato;
  font-size: 15px;
`

const MyAccordionButton = React.forwardRef(
  ({ leftIcons, text, panelIsOpen, className, ...props }, ref) => (
    <div className={className}>
      <AccordionButton ref={ref} {...props}>
        <StyledListEntry
          leftIcons={leftIcons}
          primaryText={text}
          rightIcons={
            panelIsOpen ? <ChevronDown size="21" /> : <ChevronLeft size="21" />
          }
          ref={ref}
          {...props}
        />
      </AccordionButton>
    </div>
  ),
)
MyAccordionButton.displayName = 'MyAccordionButton'

const StyledAccordionButton = styled(MyAccordionButton)`
  [data-reach-accordion-button] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0px;
    background: white;
    border: none;
  }
`

export default StyledAccordionButton
