import ResourceAccordion from '../ui/ResourcesAccordion'

const Accordion = ({ typeData }) =>
  typeData.type_names.map(({ typeName, scientificName }, index) => (
    <ResourceAccordion
      key={index}
      typeName={typeName}
      scientificName={scientificName}
    ></ResourceAccordion>
  ))

export default Accordion
