import { ChevronRight } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { LANGUAGE_OPTIONS } from '../../i18n'
import { updateSettings } from '../../redux/settingsSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import ListEntry from '../ui/ListEntry'
import RadioTiles from '../ui/RadioTiles'
import { Select } from '../ui/Select'
import SocialButtons from '../ui/SocialButtons'
import Bicycling from './mapTiles/bicycling.png'
import Road from './mapTiles/road.png'
import Satellite from './mapTiles/satellite.png'
import Terrain from './mapTiles/terrain.png'
import Transit from './mapTiles/transit.png'

const Page = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding: 26px;
  overflow: auto;
  ${({ desktop }) =>
    desktop && 'padding-top: 0; h3:first-child { margin-top: 8px; }'}

  > h2 {
    margin-top: 0;
  }

  > *:not(:last-child) {
    margin-bottom: 14px;
  }

  > h3 {
    font-weight: normal;
    font-size: 1rem;
    color: ${({ theme }) => theme.tertiaryText};
    margin: 24px 0;
  }

  > h5 {
    margin: 0px;
    color: ${({ theme }) => theme.secondaryText};
  }
`

const StyledListEntry = styled(ListEntry)`
  margin: 7px -26px;
  width: calc(100% + 26px + 26px);
  padding: 0 26px;

  :not(:last-child) {
    margin-bottom: 7px;
  }
`

const StyledSocialButtons = styled(SocialButtons)`
  width: 100%;
  display: flex;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.text};
  }

  svg {
    height: 32px;
  }
`

const SettingsPage = ({ desktop }) => {
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)

  const history = useAppHistory()

  const { t, i18n } = useTranslation()

  const DISTANCE_UNIT_OPTIONS = [
    { value: 'metric', label: t('metric') },
    { value: 'imperial', label: t('imperial') },
  ]

  const updateUnitsSetting = (object) => {
    dispatch(updateSettings({ distanceUnit: object.value }))
  }

  return (
    <Page desktop={desktop}>
      {!desktop && <h2>{t('settings')}</h2>}
      <h3>{t('glossary.data')}</h3>

      {[
        {
          field: 'showLabels',
          label: t('glossary.labels'),
        },
      ].map(({ field, label }) => (
        <LabeledRow
          key={field}
          left={
            <Checkbox
              id={field}
              onClick={(e) =>
                dispatch(
                  updateSettings({
                    [field]: e.target.checked,
                  }),
                )
              }
              checked={settings[field]}
            />
          }
          label={<label htmlFor={field}>{label}</label>}
        />
      ))}

      <h3>{t('glossary.map')}</h3>

      <h5>{t('basemap')}</h5>

      <RadioTiles
        options={[
          {
            label: t('roadmap'),
            value: 'roadmap',
            image: Road,
          },
          {
            label: t('side_menu.terrain'),
            value: 'terrain',
            image: Terrain,
          },
          {
            label: t('side_menu.satellite'),
            value: 'hybrid',
            image: Satellite,
          },
        ]}
        value={settings.mapType}
        onChange={(value) =>
          dispatch(
            updateSettings({
              mapType: value,
            }),
          )
        }
      />

      <h5>{t('overlay')}</h5>

      <RadioTiles
        options={[
          {
            label: t('side_menu.bicycle'),
            value: 'BicyclingLayer',
            image: Bicycling,
          },
          {
            label: t('side_menu.transit'),
            value: 'TransitLayer',
            image: Transit,
          },
        ]}
        value={settings.mapLayers.length === 0 ? null : settings.mapLayers[0]}
        onChange={(value) => {
          if (value === settings.mapLayers[0]) {
            value = null
          }
          dispatch(
            updateSettings({
              mapLayers: value ? [value] : [],
            }),
          )
        }}
      />
      {[
        {
          field: 'showBusinesses',
          label: t('poi'),
        },
      ].map(({ field, label }) => (
        <LabeledRow
          key={field}
          left={
            <Checkbox
              id={field}
              onClick={(e) =>
                dispatch(
                  updateSettings({
                    [field]: e.target.checked,
                  }),
                )
              }
              checked={settings[field]}
            />
          }
          label={<label htmlFor={field}>{label}</label>}
        />
      ))}

      <h3>{t('side_menu.regional')}</h3>

      <LabeledRow
        label={<label htmlFor="languagePreference">{t('language')}</label>}
        right={
          <Select
            options={LANGUAGE_OPTIONS}
            value={LANGUAGE_OPTIONS.find(
              (option) => option.value === i18n.language,
            )}
            onChange={(option) => {
              i18n.changeLanguage(option.value)
            }}
            isSearchable={false}
            menuPlacement="top"
          />
        }
      />
      {!desktop && (
        <LabeledRow
          label={<label htmlFor="distanceUnit">{t('units')}</label>}
          right={
            <Select
              options={DISTANCE_UNIT_OPTIONS}
              onChange={updateUnitsSetting}
              value={DISTANCE_UNIT_OPTIONS.find(
                (option) => option.value === settings.distanceUnit,
              )}
            />
          }
        />
      )}

      {!desktop && (
        <>
          <h3>{t('glossary.about')}</h3>
          <StyledSocialButtons />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" />}
            primaryText={t('pages.project')}
            onClick={() => history.push('/about')}
          />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" />}
            primaryText={t('pages.data')}
            onClick={() => history.push('/data')}
          />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" />}
            primaryText={t('pages.sharing')}
            onClick={() => history.push('/sharing')}
          />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" />}
            primaryText={t('pages.press')}
            onClick={() => history.push('/press')}
          />
        </>
      )}
    </Page>
  )
}

export default SettingsPage
