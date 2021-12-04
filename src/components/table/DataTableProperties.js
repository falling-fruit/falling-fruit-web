import { LinkExternal } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

import { RESOURCES } from '../entry/resources'
import { theme } from '../ui/GlobalStyle'

const TableLinkPreview = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`
const NameLink = styled.a`
  font-weight: normal;
  color: ${({ theme }) => theme.secondaryText} !important;
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
  link: function LinkFormat({ url }) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        Link <LinkExternal size="14" color={theme.orange} />
      </a>
    )
  },
  links: ({ links }) =>
    links.map((link, index) => <ResourceList key={index} url={link} />),
  name: function NameFormat({ name, url }) {
    return <NameLink href={url}>{name}</NameLink>
  },
  created_at: ({ created_at }) =>
    new Date(created_at).toISOString().split('T')[0],
}

const SORTERS = {
  links: customLinkSort,
}

export { FORMATTERS, SORTERS }
