import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const NamesBlock = styled.span`
  .select__control & {
    display: flex;
    flex-wrap: wrap;
  }
  .select__option & {
    display: block;
  }
`

const CommonName = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.headerText};
  .select__control & {
    margin-inline-end: 0.5em;
  }
`

const ScientificName = styled.span`
  .select__option & {
    display: block;
  }

  font-weight: normal;
  font-style: italic;
  color: ${({ theme }) => theme.secondaryText};
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

export const TypeName = ({ commonName, scientificName, synonyms }) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  return (
    <TypeNameWrapper>
      <NamesBlock>
        {commonName && <CommonName>{commonName}</CommonName>}
        {scientificName && (
          <ScientificName
            dir="ltr"
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            {scientificName}
          </ScientificName>
        )}
      </NamesBlock>
      {synonyms?.length > 0 && <Synonyms> {synonyms.join(' · ')}</Synonyms>}
    </TypeNameWrapper>
  )
}
