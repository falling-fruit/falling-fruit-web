import { Calendar } from '@styled-icons/boxicons-regular'
import { Flag, Map, Star } from '@styled-icons/boxicons-solid'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { useTypesById } from '../../redux/useTypesById'
import { getImportById } from '../../utils/api'
import { hasSeasonality } from '../../utils/locationInfo'
import { ReportModal } from '../form/ReportModal'
import Button from '../ui/Button'
import { theme } from '../ui/GlobalStyle'
import { LoadingOverlay } from '../ui/LoadingIndicator'
import ResetButton from '../ui/ResetButton'
import { Tag, TagList } from '../ui/Tag'
import { TextContent } from './Entry'
import {
  ACCESS_TYPE,
  formatISOString,
  formatSeasonality,
} from './textFormatters'
import TypesHeader from './TypesHeader'

const IconBesideText = styled.div`
  display: flex;
  color: ${({ theme }) => theme.secondaryText};
  font-style: normal;
  font-weight: ${($props) => ($props.bold ? 'bold' : 'normal')};
  align-items: center;

  ${'' /* TODO: Add another wrapper */}
  & + & {
    margin-top: 4px !important;
  }

  p {
    margin: 0 0 0 4px;
    font-size: 0.875rem;
  }
`
const LocationText = styled(ResetButton)`
  font-weight: bold;
  text-align: left;
  font-size: 0.875rem;
  margin: 0 0 0 4px;
  flex: 1;
  color: ${({ theme }) => theme.secondaryText};
`

// Wraps description, last updated text, and review and report buttons
const Description = styled.section`
  p {
    font-size: 1rem;
  }

  & > *:not(:first-child) {
    margin-top: 14px;
  }

  & > p:first-child {
    color: ${({ theme }) => theme.secondaryText};
    margin-bottom: 14px;
  }

  & > .updatedTime {
    display: block;
    font-style: italic;
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
  }

  button {
    margin-right: 14px;
  }
`

const EntryOverview = ({ locationData, className }) => {
  const [importDatasetName, setImportDatasetName] = useState()
  const [isLoading, setIsLoading] = useState(true)
  //console.log(getImportById(locationData.import_id), 'HERE')
  useEffect(() => {
    async function fetchImportData() {
      if (locationData.import_id) {
        const importData = await getImportById(locationData.import_id)
        console.log(importData, 'Here')
        setImportDatasetName(importData.name)

        setIsLoading(false)
      }
    }

    fetchImportData()
  }, [])

  console.log(locationData)
  const { getLocationTypes } = useTypesById()
  const history = useHistory()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const { t } = useTranslation()

  const handleAddressClick = () => {
    history.push(`/map/entry/${locationData.id}`)
    // Disabling zoom in for now
  }

  const tagList = locationData && (
    <TagList>
      {locationData.access && (
        <Tag color={theme.tag.access}>{ACCESS_TYPE[locationData.access]}</Tag>
      )}
      {locationData.unverified ? (
        <Tag color={theme.tag.unverified}>{t('Unverified')}</Tag>
      ) : (
        <Tag color={theme.tag.verified}>{t('Verified')}</Tag>
      )}
    </TagList>
  )

  return (
    <div className={className}>
      <>
        {isReportModalOpen && (
          <ReportModal
            locationId={locationData.id}
            name={getLocationTypes(locationData)}
            onDismiss={() => setIsReportModalOpen(false)}
          />
        )}
        <TextContent>
          {tagList}
          <TypesHeader typeIds={locationData.type_ids} />
          <Description>
            <p>{locationData.description}</p>

            <IconBesideText bold onClick={handleAddressClick} tabIndex={0}>
              <Map color={theme.secondaryText} size={20} />
              <LocationText>
                {locationData.address ??
                  `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(
                    6,
                  )}`}
              </LocationText>
            </IconBesideText>
            {hasSeasonality(locationData) && (
              <IconBesideText>
                <Calendar color={theme.secondaryText} size={20} />
                <p>
                  {formatSeasonality(
                    locationData.season_start,
                    locationData.season_stop,
                    locationData.no_season,
                  )}
                </p>
              </IconBesideText>
            )}

            <p className="updatedTime">
              {t('Last Updated')}{' '}
              <time dateTime={locationData.updated_at}>
                {formatISOString(locationData.updated_at)}
              </time>
            </p>

            {locationData.import_id && (
              <p className="updatedTime">
                {t('Imported from')}{' '}
                <a href={`/about/dataset/${locationData.import_id}`}>
                  {importDatasetName}
                </a>
              </p>
            )}

            <div>
              <Button leftIcon={<Star />}>Review</Button>
              <Button
                leftIcon={<Flag />}
                secondary
                onClick={() => setIsReportModalOpen(true)}
              >
                Report
              </Button>
            </div>
          </Description>
        </TextContent>
      </>
      {(!locationData || isLoading) && <LoadingOverlay />}
    </div>
  )
}

export default EntryOverview
