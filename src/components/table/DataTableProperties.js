import { LinkExternal } from '@styled-icons/boxicons-regular'
import styled from 'styled-components/macro'

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

const FORMATTERS = {
  muni: ({ muni }) => (muni ? 'Tree inventory' : 'Community map'),
  link: ({ url }) =>
    url && (
      <a href={url} target="_blank" rel="noreferrer">
        <LinkExternal size="14" color={theme.orange} />
      </a>
    ),
  created_at: ({ created_at }) =>
    new Date(created_at).toISOString().slice(0, 10),
}

const SORTERS = {
  links: customLinkSort,
}

export { FORMATTERS, SORTERS, TablePreviewLink }
