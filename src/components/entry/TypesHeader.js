import {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
} from '../ui/TypesAccordion'
import ResourceList from './ResourceList'

const TypesHeader = ({ typesData }) => (
  <TypesAccordion>
    {typesData.map((typeData) => (
      <TypesAccordionItem key={typeData.id}>
        <TypesAccordionButton
          commonName={typeData.en_name}
          scientificName={typeData.scientific_name}
        />
        <TypesAccordionPanel>
          <ResourceList typeData={typeData} />
        </TypesAccordionPanel>
      </TypesAccordionItem>
    ))}
  </TypesAccordion>
)

export default TypesHeader
