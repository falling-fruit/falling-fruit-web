import {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
} from '../ui/TypesAccordion'
import TypeTitle from '../ui/TypeTitle'
import ResourceList from './ResourceList'

const TypesHeader = ({ types }) => (
  <TypesAccordion>
    {types.map((type) => {
      const typeTitle = (
        <TypeTitle
          key={type.id}
          commonName={type.commonName}
          scientificName={type.scientificName}
        />
      )

      if (Object.keys(type.urls).length > 0) {
        // At least 1 URL
        return (
          <TypesAccordionItem key={type.id}>
            <TypesAccordionButton>{typeTitle}</TypesAccordionButton>
            <TypesAccordionPanel>
              <ResourceList urls={type.urls} />
            </TypesAccordionPanel>
          </TypesAccordionItem>
        )
      } else {
        return typeTitle
      }
    })}
  </TypesAccordion>
)

export default TypesHeader
