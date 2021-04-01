import { TypesAccordion } from '../ui/TypesAccordion'

const Accordion = ({ typeData }) =>
  typeData.type_names.map(({ typeName, scientificName }, index) => (
    <TypesAccordion
      key={index}
      typeName={typeName}
      scientificName={scientificName}
    ></TypesAccordion>
  ))

export default Accordion
