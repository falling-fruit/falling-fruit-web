import styled from 'styled-components/macro'

import {
  CommonAndScientificName,
  ScientificName as ScientificNameBase,
} from '../../ui/TypeName'
import EatTheWeedsLogo from './icons/EatTheWeeds.png'
import ForagingTexasLogo from './icons/ForagingTexas.png'
import FruitipediaLogo from './icons/Fruitipedia.png'
import UrbanMushroomsLogo from './icons/UrbanMushrooms.png'
import USDALogo from './icons/USDA.svg'
import WikipediaLogo from './icons/Wikipedia.svg'
import {
  TypesAccordion,
  TypesAccordionButton,
  TypesAccordionItem,
  TypesAccordionPanel,
} from './TypesAccordion'

const StyledTypeTitle = styled(CommonAndScientificName)`
  font-family: ${({ theme }) => theme.fonts};
  text-align: start;
`

const CommonName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.headerText};
  margin-block: 0px;
`

const ScientificName = styled(ScientificNameBase)`
  display: block;
  font-size: ${(props) => (props.standalone ? '1.125rem' : '0.875rem')};
  color: ${({ theme }) => theme.text};
  margin-block: 0px;
  font-weight: normal;
`

const TypeTitle = ({ type }) => (
  <StyledTypeTitle
    type={type}
    commonNameAs={CommonName}
    scientificNameAs={ScientificName}
    scientificNameProps={{ standalone: !type.commonName }}
  />
)

const RESOURCES = [
  {
    title: 'Eat the Weeds',
    urlKey: 'eat_the_weeds',
    icon: EatTheWeedsLogo,
  },
  {
    title: 'Foraging Texas',
    urlKey: 'foraging_texas',
    icon: ForagingTexasLogo,
  },
  {
    title: 'Fruitipedia',
    urlKey: 'fruitipedia',
    icon: FruitipediaLogo,
  },
  {
    title: 'Urban Mushrooms',
    urlKey: 'urban_mushrooms',
    icon: UrbanMushroomsLogo,
  },
  {
    title: 'USDA',
    urlKey: 'usda',
    icon: USDALogo,
  },
  {
    title: 'Wikipedia',
    urlKey: 'wikipedia',
    icon: WikipediaLogo,
  },
]
const Resource = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-block-end: 5px;

  img {
    width: 25px;
    margin-inline-end: 11px;
  }
`

const ResourceList = ({ urls }) =>
  RESOURCES.map(
    ({ title, urlKey, icon }) =>
      urls?.[urlKey] && (
        <Resource
          key={urlKey}
          target="_blank"
          rel="noopener noreferrer"
          href={urls[urlKey]}
        >
          <img src={icon} alt={`${title} logo`} />
          <span>{title}</span>
        </Resource>
      ),
  )

const SimpleTypeItem = styled.div`
  margin-block-end: 15px;
`

const TypesHeader = ({ types, openable }) => {
  if (!openable) {
    return (
      <div>
        {types.map((type) => (
          <SimpleTypeItem key={type.id}>
            <TypeTitle type={type} />
          </SimpleTypeItem>
        ))}
      </div>
    )
  }

  return (
    <TypesAccordion>
      {types.map((type) => {
        const typeTitle = <TypeTitle key={type.id} type={type} />

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
          return (
            <TypesAccordionItem key={type.id}>{typeTitle}</TypesAccordionItem>
          )
        }
      })}
    </TypesAccordion>
  )
}

export default TypesHeader
