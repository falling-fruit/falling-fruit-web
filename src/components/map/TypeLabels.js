import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components/macro'

const TypeList = styled.div`
  display: flex;
  flex-direction: column;
`

const TypeItem = styled.span`
  opacity: ${(props) => (props.isSelected ? 1.0 : 0.5)};
`

const ScientificName = styled(TypeItem)`
  font-style: italic;
`

const TypeLabels = ({ typeIds }) => {
  const { types: selectedTypes } = useSelector((state) => state.filter)
  const typesAccess = useSelector((state) => state.type.typesAccess)

  return (
    <TypeList>
      {(typeIds || []).map((id, index) => {
        const type = typesAccess.getType(id)
        return !type ? null : !type.commonName && type.scientificName ? (
          <ScientificName
            key={index}
            isSelected={selectedTypes.includes(type.id)}
          >
            {type.scientificName}
          </ScientificName>
        ) : (
          <TypeItem key={index} isSelected={selectedTypes.includes(type.id)}>
            {type.commonName || type.scientificName}
          </TypeItem>
        )
      })}
    </TypeList>
  )
}

export default TypeLabels
