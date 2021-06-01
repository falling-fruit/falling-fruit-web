import styled from 'styled-components/macro'

import { RESOURCES } from './resources'

// Wraps all resource images and their links
const Resource = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 5px;

  img {
    width: 25px;
    margin-right: 11px;
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

export default ResourceList
