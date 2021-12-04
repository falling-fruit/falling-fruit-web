import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin } from '@styled-icons/boxicons-solid'
import { LocationPin } from '@styled-icons/entypo/'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'

import { getImportById } from '../../utils/api'
import { useIsMobile } from '../../utils/useBreakpoint'
import NavBack from '../desktop/NavBack'
import { IconBesideText } from '../entry/EntryOverview'
import { theme } from '../ui/GlobalStyle'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

const AboutDatasetPage = () => {
  const datasetIDMatch = useRouteMatch({
    path: '/about/dataset/:datasetID',
    exact: true,
  })

  const datasetID =
    datasetIDMatch?.params.datasetID &&
    parseInt(datasetIDMatch.params.datasetID)
  const [importData, setImportData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    async function fetchImportData() {
      setIsLoading(true)

      setImportData(await getImportById(datasetID))

      setIsLoading(false)
    }

    fetchImportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const isMobile = useIsMobile

  return (
    <div style={{ marginTop: isMobile ? '10vh' : '0px' }}>
      <NavBack isEntry></NavBack>
      {!isLoading && (
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
              <p>{importData.muni ? 'Tree Inventory' : 'Community Map'}</p>
            </IconBesideText>
            <IconBesideText>
              <MapPin color={theme.secondaryText} size={20} />
              <p> {importData.location_count} Locations</p>
            </IconBesideText>
            <IconBesideText>
              <Calendar color={theme.secondaryText} size={20} />
              <p>
                Created{' '}
                {moment(
                  importData.created_at.substring(
                    0,
                    importData.created_at.indexOf('T'),
                  ),
                ).format('MMMM Do, YYYY')}{' '}
              </p>
            </IconBesideText>
            <IconBesideText>
              <Calendar color={theme.secondaryText} size={20} />
              <p>
                Updated{' '}
                {moment(
                  importData.updated_at.substring(
                    0,
                    importData.updated_at.indexOf('T'),
                  ),
                ).format('MMMM Do, YYYY')}{' '}
              </p>
            </IconBesideText>
            <IconBesideText>
              <Copyright color={theme.secondaryText} size={20} />
              <p> {importData.license} </p>
            </IconBesideText>
          </PageTemplate>
        </PageScrollWrapper>
      )}
      {isLoading && <LoadingOverlay></LoadingOverlay>}
    </div>
  )
}

export { AboutDatasetPage }
