import styled from 'styled-components/macro'

import { RESOURCES } from '../entry/resources'

const TableLinkPreview = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`
const NameWrapper = styled.a`
  font-size: 1rem !important;
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
  links: ({ links }) =>
    links.map((link, index) => <ResourceList key={index} url={link} />),
  // eslint-disable-next-line react/display-name
  name: ({ name }) => <NameWrapper href={name}>{name}</NameWrapper>,
  created_at: ({ created_at }) =>
    new Date(created_at).toISOString().split('T')[0],
}

const SORTERS = {
  links: customLinkSort,
}

export { FORMATTERS, SORTERS }