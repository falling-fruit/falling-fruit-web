import styled from 'styled-components/macro'

const StyledTypeTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts};
`

const CommonName = styled.h2`
  font-size: 1.125rem;
  margin-top: 0px;
  margin-bottom: 0px;
`

const ScientificName = styled.h3`
  font-size: ${(props) => (props.standalone ? '1.125rem' : '0.875rem')};
  font-style: italic;
  color: ${({ theme }) => theme.text};
  margin-top: 0px;
  margin-bottom: 0px;
  font-weight: normal;
`

const TypeTitle = ({ commonName, scientificName }) => (
  <StyledTypeTitle>
    {commonName && <CommonName>{commonName}</CommonName>}
    <ScientificName standalone={!commonName}>{scientificName}</ScientificName>
  </StyledTypeTitle>
)

export default TypeTitle
