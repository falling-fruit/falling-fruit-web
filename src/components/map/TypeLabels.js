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

const getDisplayLabel = (typesAccess, id) => {
  const type = typesAccess.getType(id)
  if (!type) {
    return ''
  }

  if (type.cultivar) {
    const parentType = typesAccess.getParentType(id)
    if (
      parentType &&
      parentType.commonName &&
      parentType.scientificName &&
      (!type.commonName ||
        type.commonName.toLowerCase() === parentType.commonName.toLowerCase())
    ) {
      return `${parentType.commonName} '${type.cultivar}'`
    }
  }

  return type.commonName || <i>{type.scientificName}</i>
}

const TypeLabels = ({ typeIds }) => {
  const { types: selectedTypes } = useSelector((state) => state.filter)
  const typesAccess = useSelector((state) => state.type.typesAccess)

  return (
    <TypeList>
      {(typeIds || []).map((id, index) => {
        const displayLabel = getDisplayLabel(typesAccess, id)

        return (
          displayLabel && (
            <DisplayName
              dir="auto"
              key={index}
              isSelected={selectedTypes.includes(id)}
            >
              {displayLabel}
            </DisplayName>
          )
        )
      })}
    </TypeList>
  )
}

export default TypeLabels
