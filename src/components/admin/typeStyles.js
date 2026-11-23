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

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns }) =>
    $columns ?? 'max-content minmax(14em, 28em) minmax(0, 1fr)'};
  align-items: center;
  gap: 0.5em 1em;

  label {
    font-weight: bold;
    color: ${({ theme }) => theme.secondaryText};
  }
`
