import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin, Pin } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getImportById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { formatISOString } from '../entry/textFormatters'
import BackButton from '../ui/BackButton'
import { theme } from '../ui/GlobalStyle'
import IconBesideText from '../ui/IconBesideText'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import { Page } from '../ui/PageTemplate'
import ReturnIcon from '../ui/ReturnIcon'

const StyledNavBack = styled.div`
  svg {
    height: 20px;
    margin-inline-end: 5px;
  }
`
const AboutDatasetPage = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const history = useAppHistory()

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
    <Page>
      <StyledNavBack>
        <BackButton
          onClick={(event) => {
            event.stopPropagation()
            history.goBack()
          }}
        >
          <ReturnIcon />
          {t('layouts.back')}
        </BackButton>
      </StyledNavBack>
      <h3>
        Import #{id}: {name}
      </h3>
      <a href={url} target="_blank" rel="noreferrer">
        {url}
      </a>
      <p dir="auto" style={{ whiteSpace: 'pre-line' }}>
        {comments}
      </p>
      <IconBesideText>
        <Pin color={theme.secondaryText} size={20} />
        <p>
          {muni
            ? t('glossary.tree_inventory.one')
            : t('pages.datasets.community_map')}
        </p>
      </IconBesideText>
      <IconBesideText>
        <MapPin color={theme.secondaryText} size={20} />
        <p>{`${location_count} ${t('pages.datasets.locations')}`}</p>
      </IconBesideText>
      <IconBesideText>
        <Calendar color={theme.secondaryText} size={20} />
        <p>
          <time dateTime={created_at}>
            {t('pages.datasets.imported_on', {
              date: formatISOString(created_at, i18n.language),
            })}
          </time>
        </p>
      </IconBesideText>
      {license && (
        <IconBesideText>
          <Copyright color={theme.secondaryText} size={20} />
          <p>{license} </p>
        </IconBesideText>
      )}
    </Page>
  )
}

export { AboutDatasetPage }
