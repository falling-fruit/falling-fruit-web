import { useTypesById } from '../../redux/useTypesById'
import {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
} from '../ui/TypesAccordion'
import TypeTitle from '../ui/TypeTitle'
import ResourceList from './ResourceList'

const TypesHeader = ({ typeIds }) => {
  const { typesById, getCommonName, getScientificName } = useTypesById()

  return (
    <TypesAccordion>
      {typeIds
        .filter((id) => typesById?.[id])
        .map((id) => {
          const typeTitle = (
            <TypeTitle
              key={id}
              primaryText={getCommonName(id)}
              secondaryText={getScientificName(id)}
            />
          )

          if (Object.keys(typesById[id].urls).length > 0) {
            // At least 1 URL
            return (
              <TypesAccordionItem key={id}>
                <TypesAccordionButton>{typeTitle}</TypesAccordionButton>
                <TypesAccordionPanel>
                  <ResourceList urls={typesById[id].urls} />
                </TypesAccordionPanel>
              </TypesAccordionItem>
            )
          } else {
            return typeTitle
          }
        })}
    </TypesAccordion>
  )
}

export default TypesHeader
