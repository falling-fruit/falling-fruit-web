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

// TODO: create a component that takes in both a label and a right and left component
// TODO: use a map for the tile buttons
// TODO: fix the css for the drop down

const SettingsPage = () => {
  const [mapView, setMapView] = useState()
  const [mapOverlay, setMapOverlay] = useState()
  const [showLabels, setShowLabels] = useState()
  const [showScientificNames, setShowScientificNames] = useState()
  const [dataLanguage, setDataLanguage] = useState()

  return (
    // label tags for bicycle overview (html label look up)
    <Page>
      <h2>Settings</h2>
      <h3>Viewing Preferences</h3>
      <CheckboxLabels>
        <label htmlFor="Show Labels">
          <Checkbox
            id="Show Labels"
            name="Show Labels"
            onClick={() => setShowLabels(showLabels ? !showLabels : true)}
            checked={showLabels}
          />
          <h5>Show Labels</h5>
        </label>
      </CheckboxLabels>

      <CheckboxLabels>
        <label htmlFor="Scientific Names">
          <Checkbox
            id="Scientific Names"
            name="Scientific Names"
            onClick={() =>
              setShowScientificNames(
                showScientificNames ? !showScientificNames : true,
              )
            }
            checked={showScientificNames}
          />
          <h5>Show Scientific Names</h5>
        </label>
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
          <label htmlFor="Data Language">
            <Checkbox
              name="Data Language"
              id="Data Language"
              onClick={() =>
                setDataLanguage(dataLanguage ? !dataLanguage : true)
              }
              checked={dataLanguage}
            />
            <h5>Data Language</h5>
          </label>
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
