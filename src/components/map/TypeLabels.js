import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

const TypeList = styled.div`
  display: flex;
  flex-direction: column;
`

const DisplayName = styled.span`
  opacity: ${(props) => (props.isSelected ? 1.0 : 0.5)};
`

const ScientificDisplayName = styled(DisplayName)`
  font-style: italic;
`

const TypeLabels = ({ typeIds }) => {
  const { types: selectedTypes } = useSelector((state) => state.filter)
  const typesAccess = useSelector((state) => state.type.typesAccess)

  return (
    <TypeList>
      {(typeIds || []).map((id, index) => {
        const [displayName, displayScientificName] =
          typesAccess.getDisplayNames(id)
        if (!displayName && !displayScientificName) {
          return null
        }

        return !displayName ? (
          <ScientificDisplayName
            key={index}
            isSelected={selectedTypes.includes(id)}
          >
            {displayScientificName}
          </ScientificDisplayName>
        ) : (
          <DisplayName key={index} isSelected={selectedTypes.includes(id)}>
            {displayName}
          </DisplayName>
        )
      })}
    </TypeList>
  )
}

export default TypeLabels
