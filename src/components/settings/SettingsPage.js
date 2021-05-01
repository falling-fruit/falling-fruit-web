import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useSettings } from '../../contexts/SettingsContext'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import RadioTiles from '../ui/RadioTiles'
import { Select } from '../ui/Select'
import Bicycling from './mapTiles/bicycling.png'
import Road from './mapTiles/road.png'
import Satellite from './mapTiles/satellite.png'
import Terrain from './mapTiles/terrain.png'
import Transit from './mapTiles/transit.png'

const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
]

const Page = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding: 26px;
  overflow: auto;
  ${({ hideTitle }) =>
    hideTitle && 'padding-top: 0; h3:first-child { margin-top: 8px; }'}

  h2 {
    margin-top: 0;
  }

  > *:not(:last-child) {
    margin-bottom: 14px;
  }

  > h3 {
    font-weight: normal;
    font-size: 16px;
    color: ${({ theme }) => theme.tertiaryText};
    margin: 24px 0;
  }

  > h5 {
    margin: 0px;
    color: ${({ theme }) => theme.secondaryText};
  }
`

const SettingsPage = ({ hideTitle }) => {
  const { settings, addSetting } = useSettings()
  const [overrideDataLanguage, setOverrideDataLanguage] = useState(false)
  const { t, i18n } = useTranslation()

  return (
    <Page hideTitle={hideTitle}>
      {!hideTitle && <h2>Settings</h2>}
      <h3>{t('Viewing Preferences')}</h3>

      {[
        {
          field: t('showLabels'),
          label: t('Show Labels'),
        },
        {
          field: t('showScientificNames'),
          label: t('Show Scientific Names'),
        },
      ].map(({ field, label }) => (
        <LabeledRow
          key={field}
          left={
            <Checkbox
              id={field}
              onClick={(e) =>
                addSetting({
                  [field]: e.target.checked,
                })
              }
              checked={settings[field]}
            />
          }
          label={<label htmlFor={field}>{label}</label>}
        />
      ))}

      <h3>{t('Map Preferences')}</h3>

      <h5>{t('Map View')}</h5>

      <RadioTiles
        options={[
          {
            label: t('Default'),
            value: t('roadmap'),
            image: Road,
          },
          {
            label: t('Satellite'),
            value: t('hybrid'),
            image: Satellite,
          },
          {
            label: t('Terrain'),
            value: t('terrain'),
            image: Terrain,
          },
        ]}
        value={settings.mapType}
        onChange={(value) =>
          addSetting({
            mapType: value,
          })
        }
      />

      <h5>{t('Map Overlays')}</h5>

      <RadioTiles
        options={[
          {
            label: t('None'),
            value: null,
            image: Road,
          },
          {
            label: t('Biking'),
            value: 'BicyclingLayer',
            image: Bicycling,
          },
          {
            label: t('Transit'),
            value: 'TransitLayer',
            image: Transit,
          },
        ]}
        value={settings.mapLayers.length === 0 ? null : settings.mapLayers[0]}
        onChange={(value) =>
          addSetting({
            mapLayers: value ? [value] : [],
          })
        }
      />

      <h3>{t('Language Preferences')}</h3>

      <LabeledRow
        label={
          <label htmlFor="languagePreference">{t('Language Preference')}</label>
        }
        right={
          <Select
            options={LANGUAGE_OPTIONS}
            value={LANGUAGE_OPTIONS.find(
              (option) => option.value === i18n.language,
            )}
            onChange={(option) => {
              i18n.changeLanguage(option.value)
              console.log(i18n.language)
            }}
          />
        }
      />

      <LabeledRow
        left={
          <Checkbox
            id="dataLanguage"
            onClick={(event) => setOverrideDataLanguage(event.target.checked)}
            checked={overrideDataLanguage}
          />
        }
        label={<label htmlFor="dataLanguage">{t('Data Language')}</label>}
        right={
          <Select
            options={[]}
            isDisabled={!overrideDataLanguage}
            placeholder={t('Select...')}
          />
        }
      />
    </Page>
  )
}

export default SettingsPage
