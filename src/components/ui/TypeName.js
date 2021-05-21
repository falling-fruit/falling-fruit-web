import styled from 'styled-components'

import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'

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
  const { typesById } = useSearch()
  const { settings } = useSettings()
  // TODO: internationalize

  return (
    typesById && (
      <div>
        <CommonName>{typesById[typeId].name}</CommonName>
        {settings.showScientificNames && (
          <ScientificName>{typesById[typeId].scientific_name}</ScientificName>
        )}
      </div>
    )
  )
}
