import { AccordionButton } from '@reach/accordion'
import styled from 'styled-components/macro'

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

export default IndicatorAccordionButton
