import '@reach/accordion/styles.css'

import { AccordionButton } from '@reach/accordion'
import { ChevronDown, ChevronRight } from '@styled-icons/boxicons-regular'
import React from 'react'
import styled from 'styled-components/macro'

import { theme } from './GlobalStyle'
import ListEntry from './ListEntry'

//TODO: get rid of li from wrapping ListEntry

const StyledListEntry = styled(ListEntry)`
  width: 100%;

  .primaryText {
    font-size: 15px;
    font-weight: 700;
  }
`

const StyledAccordionButton = styled(AccordionButton)`
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

const SettingsAccordionButton = ({
  leftIcons,
  text,
  panelIsOpen,
  ...props
}) => (
  <StyledAccordionButton {...props}>
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
      {...props}
    />
  </StyledAccordionButton>
)

export default SettingsAccordionButton
