import { LinkExternal } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import { RESOURCES } from '../entry/resources'
import { theme } from '../ui/GlobalStyle'

const TablePreviewLink = styled.a`
  display: inline-flex;
  align-items: center;
  height: 20px;
  width: 20px;
  margin-right: 5px;

  img {
    width: 100%;
    height: auto;
    margin: 0;
  }
`

const customLinkSort = (rowOne, rowTwo) =>
  rowOne.links.length - rowTwo.links.length

const ResourceList = ({ url, key }) =>
  RESOURCES.map(
    ({ title, urlKey, icon }) =>
      url.includes(urlKey) && (
        <TablePreviewLink href={url} target="_blank" rel="noreferrer">
          <img src={icon} key={key} alt={`${title} logo`} />
        </TablePreviewLink>
      ),
  )

const FORMATTERS = {
  muni: ({ muni }) => (muni ? 'Tree inventory' : 'Community map'),
  link: ({ url }) =>
    url && (
      <a href={url} target="_blank" rel="noreferrer">
        Link <LinkExternal size="14" color={theme.orange} />
      </a>
    ),
  links: ({ links }) =>
    links.map((link, index) => <ResourceList key={index} url={link} />),
  created_at: ({ created_at }) =>
    new Date(created_at).toISOString().split('T')[0],
  location: ({ state, city }) => [city, state].filter(Boolean).join(', '),
}

const SORTERS = {
  links: customLinkSort,
}

export { FORMATTERS, SORTERS }
