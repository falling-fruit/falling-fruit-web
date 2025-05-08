import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

// Generic wrapper for both type and place displays
export const ItemWrapper = styled.div`
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  width: 100%;

  .select__option & {
    width: 100%;
    display: flex;
    align-items: center;
  }
`

export const DetailsBlock = styled.span`
  .select__control & {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.1em;
  }
  .select__option & {
    display: block;
  }
`

export const PrimaryName = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.headerText};
  .select__control & {
    margin-inline-end: 0.5em;
  }
`

export const SecondaryDetails = styled.span`
  .select__option & {
    display: block;
  }

  font-weight: normal;
  color: ${({ theme }) => theme.secondaryText};
`

export const CountBadge = styled.span`
  margin-inline-start: 6px;
  font-size: 0.8rem;
  background: ${({ theme }) => theme.secondaryBackground};
  border-radius: 10px;
  padding: 2px 6px;
  color: ${({ theme }) => theme.secondaryText};
  margin-left: auto;
`

// Type-specific styling for scientific name
const ScientificName = styled(SecondaryDetails)`
  font-style: italic;
`

const Synonyms = styled.span`
  color: ${({ theme }) => theme.secondaryText};

  .select__control & {
    display: none;
  }
  .select__option & {
    display: block;
    flex: 1;
    text-align: end;
  }
`

const TypeNameWrapper = styled.div`
  font-size: 0.875rem;

  .select__option & {
    width: 100%;
    display: flex;
    align-items: center;
  }
`

export const TypeName = ({ commonName, scientificName, synonyms, count }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  return (
    <ItemWrapper>
      <DetailsBlock>
        {commonName && <PrimaryName>{commonName}</PrimaryName>}
          {scientificName && (
            <ScientificName
              dir="ltr"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              {scientificName}
            </ScientificName>
          )}
      </DetailsBlock>
      {synonyms?.length > 0 && <Synonyms> {synonyms.join(' · ')}</Synonyms>}
      {count !== undefined && <CountBadge>{count}</CountBadge>}
    </ItemWrapper>
  )
}
