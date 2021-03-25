import '@reach/accordion/styles.css'

import { AccordionButton } from '@reach/accordion'
import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components'

import { theme } from './GlobalStyle'
import ListEntry from './ListEntry'

//TODO: get rid of li from wrapping ListEntry

const StyledListEntry = styled(ListEntry)`
  font-family: Lato;
  font-size: 15px;
  font-weight: 700 !important;
  text-align: left;
  width: 100%;
`

const MyAccordionButton = React.forwardRef(
  ({ leftIcons, text, panelIsOpen, className, ...props }, ref) => (
    <div className={className}>
      <AccordionButton ref={ref} {...props}>
        <StyledListEntry
          leftIcons={leftIcons}
          primaryText={text}
          rightIcons={
            panelIsOpen ? (
              <ChevronDown size="21" color={theme.orange} />
            ) : (
              <ChevronRight size="21" color={theme.orange} />
            )
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
    width: 100%;
  }
`

export default StyledAccordionButton
