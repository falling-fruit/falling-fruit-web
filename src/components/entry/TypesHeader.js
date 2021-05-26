import { useSearch } from '../../contexts/SearchContext'
import {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
} from '../ui/TypesAccordion'
import ResourceList from './ResourceList'

const TypesHeader = ({ typesData }) => {
  const { getTypeName } = useSearch()

  return (
    <TypesAccordion>
      {typesData.map((typeData) => (
        <TypesAccordionItem key={typeData.id}>
          <TypesAccordionButton
            commonName={getTypeName(typeData.id)}
            scientificName={typeData.scientific_names[0]}
          />
          <TypesAccordionPanel>
            <ResourceList typeData={typeData} />
          </TypesAccordionPanel>
        </TypesAccordionItem>
      ))}
    </TypesAccordion>
  )
}

export default TypesHeader
