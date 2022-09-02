import styled from 'styled-components/macro'

import { useTypesById } from '../../redux/useTypesById'

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
  margin-left: 5px;
  .select__option & {
    // Two lines. Has line break between common and scientific name
    display: block;
    margin-left: 0;
  }

  font-size: 0.875rem;
  font-weight: normal;
  font-style: italic;
  color: ${({ theme }) => theme.secondaryText};
`

export const TypeName = ({ typeId }) => {
  const { getCommonName, getScientificName } = useTypesById()

  return (
    <div>
      <CommonName>{getCommonName(typeId)}</CommonName>
      <ScientificName>{getScientificName(typeId)}</ScientificName>
    </div>
  )
}
