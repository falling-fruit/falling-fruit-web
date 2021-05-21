import styled from 'styled-components'

import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'

const CommonName = styled.span`
  display: ${({ isTwoLines }) => (isTwoLines ? 'block' : 'inline')};

  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.headerText};
`

const ScientificName = styled.span`
  display: ${({ isTwoLines }) => (isTwoLines ? 'block' : 'inline')};
  ${({ isTwoLines }) => !isTwoLines && 'margin-left: 5px;'}

  font-size: 14px;
  font-weight: normal;
  font-style: italic;
  color: ${({ theme }) => theme.secondaryText};
`

export const TypeName = ({ typeId, isTwoLines = false }) => {
  const { typesById } = useSearch()
  const { settings } = useSettings()
  // TODO: internationalize

  return (
    typesById && (
      <div>
        <CommonName isTwoLines={isTwoLines}>
          {typesById[typeId].name}
        </CommonName>
        {settings.showScientificNames && (
          <ScientificName isTwoLines={isTwoLines}>
            {typesById[typeId].scientific_name}
          </ScientificName>
        )}
      </div>
    )
  )
}
