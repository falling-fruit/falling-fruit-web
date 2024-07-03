import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin, Pin } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getImportById } from '../../utils/api'
import NavBack from '../desktop/NavBack'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { PageScrollWrapper, PageTemplate } from './PageTemplate'

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

  const { name, url, comments, muni, location_count, created_at, license } =
    importData

  return (
    <PageScrollWrapper>
      <PageTemplate>
        <NavBack />
        <h3>
          #{id}: {name}
        </h3>
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
        <p>{comments}</p>
        <IconBesideText>
          <Pin color={theme.secondaryText} size={20} />
          <p>{muni ? 'Tree inventory' : 'Community map'}</p>
        </IconBesideText>
        <IconBesideText>
          <MapPin color={theme.secondaryText} size={20} />
          <p>{location_count} locations</p>
        </IconBesideText>
        <IconBesideText>
          <Calendar color={theme.secondaryText} size={20} />
          <p>Imported {new Date(created_at).toISOString().slice(0, 10)}</p>
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
