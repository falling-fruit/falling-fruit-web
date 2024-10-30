import styled from 'styled-components/macro'

const CommonName = styled.span`
  .select__option & {
    display: block;
  }

  font-weight: bold;
  color: ${({ theme }) => theme.headerText};
`

const ScientificName = styled.span`
  .select__option & {
    display: block;
  }

  font-weight: normal;
  font-style: italic;
  color: ${({ theme }) => theme.secondaryText};
`

const TypeNameWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 0.875rem;

  .select__option & {
    display: block;
  }
`

export const TypeName = ({ commonName, scientificName }) => (
  <TypeNameWrapper>
    {commonName && <CommonName>{commonName}</CommonName>}
    {scientificName && <ScientificName>{scientificName}</ScientificName>}
  </TypeNameWrapper>
)
