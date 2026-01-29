import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { EMBED_HEADER_HEIGHT_PX } from '../../constants/mobileLayout'
import { LanguageSelect } from '../../i18n'
import { updateSettings } from '../../redux/settingsSlice'
import Checkbox from '../ui/Checkbox'
import LabeledRow from '../ui/LabeledRow'
import Radio from '../ui/Radio'
import RadioTiles from '../ui/RadioTiles'
import { Select } from '../ui/Select'
import GoogleBicycling from './mapTiles/google-bicycling.png'
import GoogleRoadmap from './mapTiles/google-roadmap.png'
import GoogleSatellite from './mapTiles/google-satellite.png'
import GoogleTerrain from './mapTiles/google-terrain.png'
import GoogleTransit from './mapTiles/google-transit.png'
import OSMStandard from './mapTiles/osm-standard.png'
import OSMTonerLite from './mapTiles/osm-toner-lite.png'

const SafeAreaTop = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  height: env(safe-area-inset-top, 0);
  background-color: ${({ theme }) => theme.secondaryBackground};
  z-index: 1;
`

const Page = styled.div`
  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  ${({ isEmbed, isDesktop }) => {
    if (isEmbed) {
      return `
        padding-block-start: ${10 + EMBED_HEADER_HEIGHT_PX}px;
        padding-block-end: 2em;
        padding-inline: 26px;
      `
    } else if (isDesktop) {
      return `
        padding-inline: 15px;

        h3:first-child {
          margin-block-start: 8px;
        }
      `
    } else {
      return `
        padding-block-start: calc(26px + env(safe-area-inset-top, 0));
        padding-inline: 26px;
        padding-block-end: 2em;
      `
    }
  }}

  > h2 {
    margin-block-start: 0;
  }

  > *:not(:last-child) {
    margin-block-end: 14px;
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

const GoogleMapTypes = ['roadmap', 'terrain', 'hybrid']

const Attributions = {
  'osm-standard': (
    <>
      <a
        href="https://openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </>
  ),
  'osm-toner-lite': (
    <>
      <a href="https://stadiamaps.com" target="_blank" rel="noreferrer">
        © Stadia Maps
      </a>{' '}
      <a href="https://stamen.com" target="_blank" rel="noreferrer">
        © Stamen Design
      </a>{' '}
      <a href="https://openmaptiles.org" target="_blank" rel="noreferrer">
        © OpenMapTiles
      </a>{' '}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap contributors
      </a>
    </>
  ),
}

const Attribution = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.tertiaryText};
  a {
    color: inherit;
    text-decoration: inherit;
    white-space: nowrap;
  }
`

const LabelsVisibilitySettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)

  const handleLabelVisibilityChange = (value) => {
    dispatch(
      updateSettings({
        labelVisibility: value,
      }),
    )
  }

  return (
    <>
      <LabeledRow
        left={
          <Radio
            id="labels-always-on"
            name="labelVisibility"
            value="always_on"
            checked={settings.labelVisibility === 'always_on'}
            onChange={() => handleLabelVisibilityChange('always_on')}
          />
        }
        label={
          <label htmlFor="labels-always-on">
            {t('pages.settings.labels.always_on')}
          </label>
        }
      />
      <LabeledRow
        left={
          <Radio
            id="labels-when-zoomed"
            name="labelVisibility"
            value="when_zoomed_in"
            checked={settings.labelVisibility === 'when_zoomed_in'}
            onChange={() => handleLabelVisibilityChange('when_zoomed_in')}
          />
        }
        label={
          <label htmlFor="labels-when-zoomed">
            {t('pages.settings.labels.when_zoomed_in')}
          </label>
        }
      />
      <LabeledRow
        left={
          <Radio
            id="labels-off"
            name="labelVisibility"
            value="off"
            checked={settings.labelVisibility === 'off'}
            onChange={() => handleLabelVisibilityChange('off')}
          />
        }
        label={
          <label htmlFor="labels-off">{t('pages.settings.labels.off')}</label>
        }
      />
    </>
  )
}

const MapSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)

  return (
    <>
      <h5>Google</h5>

      <RadioTiles
        options={[
          {
            label: t('pages.settings.roadmap'),
            value: 'roadmap',
            image: GoogleRoadmap,
          },
          {
            label: t('pages.settings.terrain'),
            value: 'terrain',
            image: GoogleTerrain,
          },
          {
            label: t('pages.settings.satellite'),
            value: 'hybrid',
            image: GoogleSatellite,
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

      <div
        style={
          GoogleMapTypes.includes(settings.mapType)
            ? {}
            : {
                opacity: '50%',
                filter: 'grayscale(50%)',
                pointerEvents: 'none',
              }
        }
      >
        <RadioTiles
          options={[
            {
              label: t('pages.settings.bicycle'),
              value: 'bicycle',
              image: GoogleBicycling,
            },
            {
              label: t('pages.settings.transit'),
              value: 'transit',
              image: GoogleTransit,
            },
          ]}
          value={settings.overlay}
          onChange={(value) => {
            if (value === settings.overlay) {
              value = null
            }
            dispatch(
              updateSettings({
                overlay: value,
              }),
            )
          }}
        />
        {[
          {
            field: 'showBusinesses',
            label: t('pages.settings.points_of_interest'),
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
      </div>

      <h5>OpenStreetMap</h5>

      <RadioTiles
        options={[
          {
            label: 'Standard',
            value: 'osm-standard',
            image: OSMStandard,
          },
          {
            label: 'Toner Lite',
            value: 'osm-toner-lite',
            image: OSMTonerLite,
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
      {settings.mapType in Attributions && (
        <Attribution>{Attributions[settings.mapType]}</Attribution>
      )}
    </>
  )
}

const RegionalSettings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)

  const DISTANCE_UNIT_OPTIONS = [
    { value: 'metric', label: t('pages.settings.units.metric') },
    { value: 'imperial', label: t('pages.settings.units.imperial') },
  ]

  const updateUnitsSetting = (object) => {
    dispatch(updateSettings({ distanceUnit: object.value }))
  }

  return (
    <>
      <LabeledRow
        label={
          <label htmlFor="languagePreference">
            {t('pages.settings.language')}
          </label>
        }
        right={<LanguageSelect></LanguageSelect>}
      />
      <LabeledRow
        label={
          <label htmlFor="distanceUnit">
            {t('pages.settings.units.units')}
          </label>
        }
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
    </>
  )
}

const SettingsPage = ({ isDesktop, isEmbed }) => {
  const { t } = useTranslation()

  return (
    <>
      {!isDesktop && !isEmbed && <SafeAreaTop />}
      <Page isEmbed={isEmbed} isDesktop={isDesktop}>
        {!isDesktop && <h2>{t('menu.settings')}</h2>}
        <h3>{t('pages.settings.label_visibility')}</h3>
        <LabelsVisibilitySettings />
        <h3>{t('glossary.map')}</h3>
        <MapSettings />
        {!isDesktop && (
          <>
            <h3>{t('pages.settings.regional')}</h3>
            <RegionalSettings />
          </>
        )}
      </Page>
    </>
  )
}
export default SettingsPage
