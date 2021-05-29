import { useTypesById } from '../../redux/useTypesById'
import {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
} from '../ui/TypesAccordion'
import ResourceList from './ResourceList'

const TypesHeader = ({ typeIds }) => {
  const { typesById, getCommonName, getScientificName } = useTypesById()

  return (
    <TypesAccordion>
      {typeIds.map((id) => (
        <TypesAccordionItem key={id}>
          <TypesAccordionButton
            commonName={getCommonName(id)}
            scientificName={getScientificName(id)}
          />
          <TypesAccordionPanel>
            <ResourceList urls={typesById[id].urls} />
          </TypesAccordionPanel>
        </TypesAccordionItem>
      ))}
    </TypesAccordion>
  )
}

export default TypesHeader
