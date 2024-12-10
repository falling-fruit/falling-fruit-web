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

export const ListChanges = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

export const ListItem = styled.li`
  p {
    margin: 0 0 0.5rem;
  }

  @media (max-width: 767px) {
    p {
      margin: 0 0 1rem;
    }
  }
`
