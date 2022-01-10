import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin, Pin } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getImportById } from '../../utils/api'
import NavBack from '../desktop/NavBack'
import { IconBesideText } from '../entry/EntryOverview'
import { theme } from '../ui/GlobalStyle'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const DatasetName = styled.h1`
  margin: 1rem 0;

  span {
    color: ${({ theme }) => theme.orange};
  }
`

const getFormattedDate = (utc) => {
  const [, ...date] = new Date(utc).toDateString().split(' ')
  return date.join(' ')
}

const AboutDatasetPage = () => {
  const { id } = useParams()

  const [importData, setImportData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchImportData() {
      setIsLoading(true)

      setImportData(await getImportById(id))

      setIsLoading(false)
    }

    fetchImportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (isLoading) {
    return <LoadingOverlay />
  }

  const {
    name,
    url,
    comments,
    muni,
    location_count,
    created_at,
    updated_at,
    license,
  } = importData

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <NavBack />
        <DatasetName>
          <span>#{id}</span> {name}
        </DatasetName>
        <a href={url} target="_blank" rel="noreferrer">
          Website
        </a>
        <p>{comments}</p>
        <IconBesideText>
          <Pin color={theme.secondaryText} size={20} />
          <p>{muni ? 'Tree Inventory' : 'Community Map'}</p>
        </IconBesideText>
        <IconBesideText>
          <MapPin color={theme.secondaryText} size={20} />
          <p>{location_count} Locations</p>
        </IconBesideText>
        <IconBesideText>
          <Calendar color={theme.secondaryText} size={20} />
          <p>Created {getFormattedDate(created_at)}</p>
        </IconBesideText>
        <IconBesideText>
          <Calendar color={theme.secondaryText} size={20} />
          <p>Updated {getFormattedDate(updated_at)}</p>
        </IconBesideText>
        {license && (
          <IconBesideText>
            <Copyright color={theme.secondaryText} size={20} />
            <p>{license} </p>
          </IconBesideText>
        )}
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export { AboutDatasetPage }
