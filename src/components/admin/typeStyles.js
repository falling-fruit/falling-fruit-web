import styled from 'styled-components/macro'

import ResetButton from '../ui/ResetButton'

export const Section = styled.section`
  margin-block-end: 1.5em;
`

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-block: 0 0.5em;
  font-size: 1.1rem !important;
`

export const Muted = styled.span`
  color: ${({ theme }) => theme.tertiaryText};
`

export const IconButton = styled(ResetButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  color: ${({ color, theme }) => color || theme.secondaryText};
  flex-shrink: 0;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  &:hover:enabled {
    background: ${({ theme }) => theme.secondaryBackground};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    text-align: start;
    color: ${({ theme }) => theme.tertiaryText};
    font-weight: bold;
  }

  td {
    color: ${({ theme }) => theme.secondaryText};
  }

  th,
  td {
    padding: 0.35em 0.5em;
    border-block-end: 1px solid ${({ theme }) => theme.navBackground};
    vertical-align: middle;
  }

  td.actions {
    width: 1%;
    white-space: nowrap;
  }

  td.actions > div {
    display: flex;
    justify-content: flex-end;
    gap: 2px;
  }

  td input {
    width: 100%;
    box-sizing: border-box;
    height: 2.2em;
    padding-inline: 0.5em;
    font: inherit;
  }
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 0.5em 1em;
  max-width: 32em;

  label {
    font-weight: bold;
    color: ${({ theme }) => theme.secondaryText};
  }
`
