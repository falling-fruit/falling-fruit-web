import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin } from '@styled-icons/boxicons-solid'
import { LocationPin } from '@styled-icons/entypo/'
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
    datasetIDMatch?.params.datasetID &&
    parseInt(datasetIDMatch.params.datasetID)
  console.log(datasetID)
  const [importData, setImportData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchImportData() {
      setIsLoading(true)

      setImportData(await getImportById)

      setIsLoading(false)
    }

    fetchImportData()
  }, [datasetID])

  return (
    !isLoading && (
      <PageScrollWrapper>
        <PageTemplate>
          <h1 style={{ color: theme.orange, display: 'inline' }}>
            #{datasetID}
          </h1>{' '}
          <h1 style={{ display: 'inline', padding: '10px' }}>
            {importData.name}
          </h1>
          <br></br>
          <br></br>
          <a href={importData.url}>Website</a>
          <p>{importData.comments}</p>
          <IconBesideText>
            <LocationPin color={theme.secondaryText} size={20} />
            <p> {importData.muni} </p>
          </IconBesideText>
          <IconBesideText>
            <MapPin color={theme.secondaryText} size={20} />
            <p> {importData.location_count} Locations</p>
          </IconBesideText>
          <IconBesideText>
            <Calendar color={theme.secondaryText} size={20} />
            <p>
              Created{' '}
              {importData.created_at.substring(
                0,
                importData.created_at.indexOf('T'),
              )}{' '}
            </p>
          </IconBesideText>
          <IconBesideText>
            <Calendar color={theme.secondaryText} size={20} />
            <p>
              Updated{' '}
              {importData.updated_at.substring(
                0,
                importData.updated_at.indexOf('T'),
              )}{' '}
            </p>
          </IconBesideText>
          <IconBesideText>
            <Copyright color={theme.secondaryText} size={20} />
            <p> {importData.license} </p>
          </IconBesideText>
        </PageTemplate>
      </PageScrollWrapper>
    )
  )
}

export { AboutDatasetPage }
