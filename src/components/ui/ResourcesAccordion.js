import { AccordionButton } from '@reach/accordion'
import { DownArrow, UpArrow } from '@styled-icons/boxicons-solid'
import React from 'react'
import styled from 'styled-components'

import { theme } from './GlobalStyle'

const TextContainer = styled.div`
  font-family: Lato;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  justify-content: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: normal;
  color: ${({ theme }) => theme.secondaryText};

  h5 {
    margin: 0px;
  }

  h6 {
    margin: 0px;
    font-style: italic;
  }
`

const ResourceAccordion = React.forwardRef(
  ({ className, typeName, scientificName, isPanelOpen, ...props }, ref) => (
    <span className={className}>
      <AccordionButton ref={ref} {...props}>
        <TextContainer>
          <h5>{typeName}</h5>
          <h6>{scientificName}</h6>
        </TextContainer>
        {isPanelOpen ? (
          <UpArrow size="21" color={theme.orange} />
        ) : (
          <DownArrow size="21" color={theme.orange} />
        )}
      </AccordionButton>
    </span>
  ),
)

ResourceAccordion.displayName = 'ResourceAccordion'

const StyledResourceAccordion = styled(ResourceAccordion)`
  [data-reach-accordion-button] {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0px;
    background-color: white;
    border: none;
    width: 100%;
  }
`

export default StyledResourceAccordion
