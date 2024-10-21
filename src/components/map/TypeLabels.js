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

const TypeLabels = ({ types }) => {
  const { types: selectedTypes } = useSelector((state) => state.filter)

  const typeLabels =
    types && types.length > 0
      ? types.map((type) => ({
          label: type.commonName || type.scientificName,
          isScientific: !type.commonName && type.scientificName,
          isSelected: selectedTypes.includes(type.id),
        }))
      : []

  return (
    <TypeList>
      {typeLabels.map((item, index) =>
        item.isScientific ? (
          <ScientificName key={index} isSelected={item.isSelected}>
            {item.label}
          </ScientificName>
        ) : (
          <TypeItem key={index} isSelected={item.isSelected}>
            {item.label}
          </TypeItem>
        ),
      )}
    </TypeList>
  )
}

export default TypeLabels
