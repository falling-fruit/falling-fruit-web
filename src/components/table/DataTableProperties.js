import { LinkExternal } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import { RESOURCES } from '../entry/resources'
import { theme } from '../ui/GlobalStyle'

const TableLinkPreview = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`

const customLinkSort = (rowOne, rowTwo) =>
  rowOne.links.length - rowTwo.links.length

const ResourceList = ({ url, key }) =>
  RESOURCES.map(
    ({ title, urlKey, icon }) =>
      url.includes(urlKey) && (
        <TableLinkPreview src={icon} key={key} alt={`${title} logo`} />
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
}

const SORTERS = {
  links: customLinkSort,
}

export { FORMATTERS, SORTERS }
