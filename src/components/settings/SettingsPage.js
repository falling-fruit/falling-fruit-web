import { ChevronRight } from '@styled-icons/boxicons-solid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { LANGUAGE_OPTIONS } from '../../i18n'
import { updateSettings } from '../../redux/settingsSlice'
import { useAppHistory } from '../../utils/useAppHistory'
import Button from '../ui/Button'
import ButtonToggle from '../ui/ButtonToggle'
import Checkbox from '../ui/Checkbox'
import { theme } from '../ui/GlobalStyle'
import LabeledRow from '../ui/LabeledRow'
import ListEntry from '../ui/ListEntry'
import RadioTiles from '../ui/RadioTiles'
import { Select } from '../ui/Select'
import Bicycling from './mapTiles/bicycling.png'
import Road from './mapTiles/road.png'
import Satellite from './mapTiles/satellite.png'
import Terrain from './mapTiles/terrain.png'
import Transit from './mapTiles/transit.png'

const DISTANCE_UNIT_OPTIONS = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
]

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

const UserWrapper = styled.div`
  display: flex;
  align-items: center;

  > p {
    margin: 0px;
    color: ${({ theme }) => theme.secondaryText};
  }

  * {
    flex-grow: 1;
  }

  > *:not(:last-child) {
    margin-right: 0.5em;
  }
`

const SettingsPage = ({ desktop }) => {
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)
  const user = useSelector((state) => state.auth.user)

  const history = useAppHistory()

  const { t, i18n } = useTranslation()

  const updateUnitsSetting = (object) => {
    dispatch(updateSettings({ distanceUnit: object.value }))
  }

  return (
    <Page desktop={desktop}>
      {!desktop && (
        <>
          <h2>{t('Settings')}</h2>

          <h3>{t('Account')}</h3>
          <UserWrapper>
            {user ? (
              <>
                <p>Logged in as {user.name || user.email}</p>
                <Button secondary onClick={() => history.push('/users/edit')}>
                  View account
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => history.push('/users/sign_in')}>
                  Login
                </Button>
                <Button
                  secondary
                  onClick={() => history.push('/users/sign_up')}
                >
                  Sign up
                </Button>
              </>
            )}
          </UserWrapper>
        </>
      )}

      <h3>{t('Viewing preferences')}</h3>

      {[
        {
          field: 'showLabels',
          label: t('Show labels'),
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
      {!desktop && (
        <LabeledRow
          label={<label htmlFor="distanceUnit">{t('Units')}</label>}
          right={
            <ButtonToggle
              options={DISTANCE_UNIT_OPTIONS}
              onChange={updateUnitsSetting}
              value={settings.distanceUnit}
            />
          }
        />
      )}

      <h3>{t('Map preferences')}</h3>

      <h5>{t('Map view')}</h5>

      <RadioTiles
        options={[
          {
            label: t('Default'),
            value: 'roadmap',
            image: Road,
          },
          {
            label: t('Satellite'),
            value: 'hybrid',
            image: Satellite,
          },
          {
            label: t('Terrain'),
            value: 'terrain',
            image: Terrain,
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

      <h5>{t('Map overlays')}</h5>

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
          dispatch(
            updateSettings({
              mapLayers: value ? [value] : [],
            }),
          )
        }
      />
      {[
        {
          field: 'showBusinesses',
          label: t('Show businesses'),
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

      <h3>{t('Language preferences')}</h3>

      <LabeledRow
        label={
          <label htmlFor="languagePreference">{t('Language preference')}</label>
        }
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
        <>
          <h3>{t('About us')}</h3>
          <StyledListEntry
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={'The project'}
            onClick={() => history.push('/about')}
          />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={'The data'}
            onClick={() => history.push('/data')}
          />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={'Sharing the harvest'}
            onClick={() => history.push('/sharing')}
          />
          <StyledListEntry
            rightIcons={<ChevronRight size="16" color={theme.blue} />}
            primaryText={'In the press'}
            onClick={() => history.push('/press')}
          />
        </>
      )}
    </Page>
  )
}

export default SettingsPage
