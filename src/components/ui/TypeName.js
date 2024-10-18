import styled from 'styled-components/macro'

const CommonName = styled.span`
  .select__option & {
    // Two lines. Has line break between common and scientific name
    display: block;
  }

  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.headerText};
`

const ScientificName = styled.span`
  margin-left: ${(props) => (props.standalone ? '0' : '5px')};
  .select__option & {
    // Two lines. Has line break between common and scientific name
    display: block;
    margin-left: 0;
  }

  font-size: ${(props) => (props.standalone ? '0.975rem' : '0.875rem')};
  font-weight: normal;
  font-style: italic;
  color: ${({ theme }) => theme.secondaryText};
`

export const TypeName = ({ commonName, scientificName }) => (
  <div>
    {commonName && <CommonName>{commonName}</CommonName>}
    <ScientificName standalone={!commonName}>{scientificName}</ScientificName>
  </div>
)
