import '@reach/accordion/styles.css'

import { AccordionButton } from '@reach/accordion'
import React from 'react'
import styled from 'styled-components'

//TODO: get rid of li from wrapping ListEntry

const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 36px;
  & > * {
    padding: 8px;
  }
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.secondaryText};
  justify-content: center;
  margin-left: 18px;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  div {
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const MyAccordionButton = React.forwardRef(
  ({ leftIcons, text, panelIsOpen, className, ...props }, ref) => (
    <div className={className}>
      <AccordionButton ref={ref} {...props}>
        <Icons>{leftIcons}</Icons>
        <TextContainer>{text}</TextContainer>
        <Icons>{panelIsOpen}</Icons>
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
  }
  [data-reach-accordion-button][aria-expanded] {
    /* styles for buttons in open accordion items */
  }
  [data-reach-accordion-button][disabled] {
    /* styles for all buttons in disabled accordion items */
  }
`

export default StyledAccordionButton
