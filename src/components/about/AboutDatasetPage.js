import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin, Pin } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { getImportById } from '../../utils/api'
import { IconBesideText } from '../entry/EntryOverview'
import { theme } from '../ui/GlobalStyle'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const AboutDatasetPage = () => {
  const datasetIDMatch = useRouteMatch({
    path: '/about/dataset/:datasetID',
    exact: true,
  })

  const datasetID =
    datasetIDMatch?.params.datasetID && parseInt(datasetIDMatch.params.entryId)

  const [importData, setImportData] = useState()
  //const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchImportData() {
      //setIsLoading(true)

      setImportData(await getImportById(datasetID))

      //      setIsLoading(false)
    }

    fetchImportData()
  }, [datasetID])

  const createdAt = importData.created_at
  const updatedAt = importData.updated_at
  const name = importData.name
  const url = importData.url
  const comments = importData.comments
  const license = importData.license
  const muni = importData.muni
  const locationCount = importData.location_count
  return (
    <PageScrollWrapper>
      <PageTemplate>
        <h1>
          #{datasetID} {name}
        </h1>

        <href a={url} />
        <p>{comments}</p>
        <IconBesideText>
          <Pin color={theme.secondaryText} size={20} />
          <p> {muni} </p>
        </IconBesideText>
        <IconBesideText>
          <MapPin color={theme.secondaryText} size={20} />
          <p> {locationCount} </p>
        </IconBesideText>
        <IconBesideText>
          <Calendar color={theme.secondaryText} size={20} />
          <p> {createdAt} </p>
        </IconBesideText>
        <IconBesideText>
          <Calendar color={theme.secondaryText} size={20} />
          <p> {updatedAt} </p>
        </IconBesideText>
        <IconBesideText>
          <Copyright color={theme.secondaryText} size={20} />
          <p> {license} </p>
        </IconBesideText>
        <p>Hi</p>
      </PageTemplate>
    </PageScrollWrapper>
  )
}

export { AboutDatasetPage }
