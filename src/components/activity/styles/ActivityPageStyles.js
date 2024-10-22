import styled from 'styled-components'

export const PlantLink = styled.a`
  color: #007bff !important;
  font-weight: bold !important;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const AuthorName = styled.span`
  color: grey;
  font-weight: bold;
  font-size: 1rem;
`

export const ActivityText = styled.span`
  font-size: 1rem;
  color: grey;
`

export const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

export const ListItem = styled.li`
  margin-bottom: 1rem;
`

export const LazyLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 5rem;
`
