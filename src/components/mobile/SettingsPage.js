import { useState } from 'react'
import styled from 'styled-components/macro'

import Checkbox from '../ui/Checkbox'
import CircleIcon from '../ui/CircleIcon'
import { Select } from '../ui/Select'
import TileButton from '../ui/TileButton'
import ToggleSwitch from '../ui/ToggleSwitch'

// rename to pagestyling or something
const Page = styled.div`
  margin: 26px;

  & > *:not(:last-child) {
    margin-bottom: 14px;
  }

  h5 {
    margin: 0px;
    color: ${({ theme }) => theme.secondaryText};
  }

  small {
    color: ${({ theme }) => theme.tertiaryText};
  }
`

// rename because this contains both the checkbox and the tag that goes with it
const CheckboxLabels = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

// rename to something more holistic
const ToggleLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledCircleIcon = styled(CircleIcon)`
  height: 70px;
  width: 70px;
  border-radius: 5%;
  color: gray;
`

const SettingsPage = () => {
  const [mapView, setMapView] = useState()
  const [mapOverlay, setMapOverlay] = useState()

  return (
    // label tags for bicycle overview (html label look up)
    <Page>
      <h2>Settings</h2>
      <h3>Viewing Preferences</h3>
      <CheckboxLabels>
        <label htmlFor="Show Labels">
          <Checkbox id="Show Labels" name="Show Labels" />
          <h5>Show Labels</h5>
        </label>
      </CheckboxLabels>

      <CheckboxLabels>
        <Checkbox name="Scientific Names" />
        <h5>Show Scientific Names</h5>
      </CheckboxLabels>

      <h3>Map Preferences</h3>
      <ToggleLabels>
        <h5>Show Labels</h5>
        <ToggleSwitch />
      </ToggleLabels>

      <h5>Map View</h5>
      <ToggleLabels>
        <TileButton
          id="Default"
          label="Default"
          onClick={() => setMapView('Default')}
          selected={mapView === 'Default'}
        />

        <TileButton
          id="Satellite"
          label="Satellite"
          onClick={() => setMapView('Satellite')}
          selected={mapView === 'Satellite'}
        />

        <TileButton
          id="Terrain"
          label="Terrain"
          onClick={() => setMapView('Terrain')}
          selected={mapView === 'Terrain'}
        />
      </ToggleLabels>

      <h5>Map Overlays</h5>
      <ToggleLabels>
        <TileButton
          id="None"
          label="None"
          onClick={() => {
            setMapOverlay('None')
          }}
          selected={mapOverlay === 'None'}
        />

        <TileButton
          id="Biking"
          label="Biking"
          onClick={() => {
            setMapOverlay('Biking')
          }}
          selected={mapOverlay === 'Biking'}
        />

        <TileButton
          id="Transit"
          label="Transit"
          onClick={() => {
            setMapOverlay('Transit')
          }}
          selected={mapOverlay === 'Transit'}
        />
      </ToggleLabels>

      <h3>Language Preferences</h3>

      <ToggleLabels>
        <h5>Language Preference</h5>
        <Select
          width="200px"
          options={[]}
          placeholder="English"
          isMulti
          closeMenuOnSelect={false}
          blurInputOnSelect={false}
        />
      </ToggleLabels>

      <ToggleLabels>
        <CheckboxLabels>
          <Checkbox name="Show Labels" />
          <h5>Data Language</h5>
        </CheckboxLabels>
        <Select
          width="200px"
          options={[]}
          placeholder="English"
          isMulti
          closeMenuOnSelect={false}
          blurInputOnSelect={false}
        />
      </ToggleLabels>

      <StyledCircleIcon />
    </Page>
  )
}

export default SettingsPage
