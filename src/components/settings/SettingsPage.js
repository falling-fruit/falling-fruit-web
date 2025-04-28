import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { LanguageSelect } from '../../i18n'
import { updateSettings } from '../../redux/settingsSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import Checkbox from '../ui/Checkbox'
import ForwardChevronIcon from '../ui/ForwardChevronIcon'
import LabeledRow from '../ui/LabeledRow'
import ListEntry, { PrimaryText } from '../ui/ListEntry'
import RadioTiles from '../ui/RadioTiles'
import { Select } from '../ui/Select'
import SocialButtons from '../ui/SocialButtons'
import GoogleBicycling from './mapTiles/google-bicycling.png'
import GoogleRoadmap from './mapTiles/google-roadmap.png'
import GoogleSatellite from './mapTiles/google-satellite.png'
import GoogleTerrain from './mapTiles/google-terrain.png'
import GoogleTransit from './mapTiles/google-transit.png'
import OSMStandard from './mapTiles/osm-standard.png'
import OSMTonerLite from './mapTiles/osm-toner-lite.png'

const Page = styled.div`
  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  @media ${({ theme }) => theme.device.mobile} {
    padding-block-start: 26px;
    padding-inline: 26px;
  }

  @media ${({ theme }) => theme.device.desktop} {
    padding-inline: 15px;

    h3:first-child {
      margin-block-start: 8px;
    }
  }

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

const StyledListEntry = styled(ListEntry)`
  margin: 7px -26px;
  width: calc(100% + 26px + 26px);
  padding: 0 26px;

  :not(:last-child) {
    margin-block-end: 7px;
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

  const { t } = useTranslation()

  const DISTANCE_UNIT_OPTIONS = [
    { value: 'metric', label: t('pages.settings.units.metric') },
    { value: 'imperial', label: t('pages.settings.units.imperial') },
  ]

  const updateUnitsSetting = (object) => {
    dispatch(updateSettings({ distanceUnit: object.value }))
  }

  return (
    <Page desktop={desktop}>
      {!desktop && <h2>{t('menu.settings')}</h2>}
      <h3>{t('pages.settings.data')}</h3>

      {[
        {
          field: 'showLabels',
          label: t('pages.settings.labels'),
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

      {!desktop && (
        <>
          <h3>{t('pages.settings.regional')}</h3>

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
      )}

      {!desktop && (
        <>
          <h3>{t('glossary.about')}</h3>
          <StyledSocialButtons />
          <StyledListEntry
            rightIcons={<ForwardChevronIcon size="16" />}
            onClick={() => history.push('/changes')}
          >
            <PrimaryText>{t('glossary.activity')}</PrimaryText>
          </StyledListEntry>
          <StyledListEntry
            rightIcons={<ForwardChevronIcon size="16" />}
            onClick={() => history.push('/about')}
          >
            <PrimaryText>
              {t('layouts.application.menu.the_project')}
            </PrimaryText>
          </StyledListEntry>
          <StyledListEntry
            rightIcons={<ForwardChevronIcon size="16" />}
            onClick={() => history.push('/data')}
          >
            <PrimaryText>{t('layouts.application.menu.the_data')}</PrimaryText>
          </StyledListEntry>
          <StyledListEntry
            rightIcons={<ForwardChevronIcon size="16" />}
            onClick={() => history.push('/sharing')}
          >
            <PrimaryText>
              {t('layouts.application.menu.sharing_the_harvest')}
            </PrimaryText>
          </StyledListEntry>
          <StyledListEntry
            rightIcons={<ForwardChevronIcon size="16" />}
            onClick={() => history.push('/press')}
          >
            <PrimaryText>
              {t('layouts.application.menu.in_the_press')}
            </PrimaryText>
          </StyledListEntry>
        </>
      )}
    </Page>
  )
}

export default SettingsPage
