import { useState } from 'react'
import styled from 'styled-components/macro'

import { useSettings } from '../../contexts/SettingsContext'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import RadioTiles from '../ui/RadioTiles'
import { Select } from '../ui/Select'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
]

const Page = styled.div`
  padding: 26px;

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

const SettingsPage = () => {
  const { settings, addSetting } = useSettings()
  const [overrideDataLanguage, setOverrideDataLanguage] = useState(false)

  return (
    <Page>
      <h2>Settings</h2>
      <h3>Viewing Preferences</h3>

      {[
        {
          field: 'showLabels',
          label: 'Show Labels',
        },
        {
          field: 'showScientificNames',
          label: 'Show Scientific Names',
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

      <h3>Map Preferences</h3>

      <h5>Map View</h5>

      <RadioTiles
        options={[
          {
            label: 'Default',
            value: 'roadmap',
          },
          {
            label: 'Satellite',
            value: 'satellite',
          },
          {
            label: 'Terrain',
            value: 'terrain',
          },
        ]}
        value={settings.mapType}
        onChange={(value) =>
          addSetting({
            mapType: value,
          })
        }
      />

      <h5>Map Overlays</h5>

      <RadioTiles
        options={[
          {
            label: 'None',
            value: 'none',
          },
          {
            label: 'Biking',
            value: 'biking',
          },
          {
            label: 'Transit',
            value: 'transit',
          },
        ]}
        value={settings.mapOverlay}
        onChange={(value) =>
          addSetting({
            mapOverlay: value,
          })
        }
      />

      <h3>Language Preferences</h3>

      <LabeledRow
        label={<label htmlFor="languagePreference">Language Preference</label>}
        right={
          <Select
            options={LANGUAGE_OPTIONS}
            value={LANGUAGE_OPTIONS.find(
              (option) => option.value === settings.language,
            )}
            onChange={(option) => addSetting({ language: option.value })}
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
        label={<label htmlFor="dataLanguage">Data Language</label>}
        right={
          <Select
            options={[]}
            isDisabled={!overrideDataLanguage}
            placeholder="Select..."
          />
        }
      />
    </Page>
  )
}

export default SettingsPage
