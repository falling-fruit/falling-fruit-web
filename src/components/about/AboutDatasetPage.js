import { Calendar } from '@styled-icons/boxicons-regular'
import { Copyright, MapPin, Pin } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getImportById } from '../../utils/api'
import { useAppHistory } from '../../utils/useAppHistory'
import { formatISOString } from '../entry/textFormatters'
import { theme } from '../ui/GlobalStyle'
import { PageHeader } from '../ui/Headers'
import IconBesideText from '../ui/IconBesideText'
import { Page } from '../ui/PageTemplate'

const AboutDatasetPage = () => {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const history = useAppHistory()

  const [importData, setImportData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchImportData() {
      setIsLoading(true)

      try {
        setImportData(await getImportById(id))
      } catch (error) {
        history.push('/map')
        toast.error(
          t('error_message.api.fetch_import_failed', {
            id,
            message: error.message || t('error_message.unknown_error'),
          }),
        )
        return
      }

      setIsLoading(false)
    }

    fetchImportData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const { name, url, comments, muni, location_count, created_at, license } =
    importData

  return (
    <Page showBackButton>
      {isLoading ? (
        <>
          <PageHeader>
            <Skeleton width="14em" />
          </PageHeader>
          <Skeleton width="16em" />
          <p>
            <Skeleton count={2} width="80%" />
          </p>
          <IconBesideText>
            <Pin color={theme.secondaryText} size={20} />
            <p>
              <Skeleton width="8em" />
            </p>
          </IconBesideText>
          <IconBesideText>
            <MapPin color={theme.secondaryText} size={20} />
            <p>
              <Skeleton width="7em" />
            </p>
          </IconBesideText>
          <IconBesideText>
            <Calendar color={theme.secondaryText} size={20} />
            <p>
              <Skeleton width="10em" />
            </p>
          </IconBesideText>
        </>
      ) : (
        <>
          <PageHeader>
            {t('pages.datasets.import_id_and_name', { id, name })}
          </PageHeader>
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
            <p>{`${location_count} ${location_count === 1 ? t('glossary.locations.one') : t('glossary.locations.other')}`}</p>
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
        </>
      )}
    </Page>
  )
}

export { AboutDatasetPage }
