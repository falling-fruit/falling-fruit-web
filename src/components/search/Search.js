import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
// TODO: Switch to https://www.npmjs.com/package/@googlemaps/js-api-loader
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'

import Input from '../ui/Input'
import SearchContext from './SearchContext'
import SearchEntry from './SearchEntry'

const getViewportBounds = async (placeId) => {
  const results = await getGeocode({ placeId })
  const {
    geometry: { viewport },
  } = results[0]

  const [ne, sw] = [viewport.getNorthEast(), viewport.getSouthWest()]
  return {
    ne: { lat: ne.lat(), lng: ne.lng() },
    sw: { lat: sw.lat(), lng: sw.lng() },
  }
}

// TODO: ask Siraj how highlighting should look
// TODO: for long option descriptions, scroll to beginning of input
const StyledComboboxPopover = styled(ComboboxPopover)`
  border: none;
  background: none;
  padding-top: 8px;
`

const Search = (props) => {
  const { setViewport } = useContext(SearchContext)

  // Hack: Reach's Combobox passes the ComboboxOption's value to handleSelect
  // So we will keep a map of the value to the place id, which handleSelect also needs
  const descriptionToPlaceId = useRef({})

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete()

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const locSuccess = (pos) => {
    console.log('success!')
    var lat = pos.coords.latitude
    var lon = pos.coords.longitude
    alert(`${lat} ${lon}`)

    return [lat, lon]
  }

  const locError = (err) => {
    console.log('error!')
    alert(err)
  }

  const handleLocationError = (browserHasGeolocation) => {
    console.log(
      browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : "Error: Your browser doesn't support geolocation.",
    )
  }
  useEffect(() => {
    if (navigator.geolocation) {
      console.log('entered')

      navigator.geolocation.getCurrentPosition(locSuccess, locError, {
        timeout: 5000,
      })
    } else {
      console.log('ERR')

      // Browser doesn't support Geolocation
      handleLocationError(false)
    }
  }, [])

  let currentLocation = {
    place_id: '00000000000000',
    description: 'Current Location',
    structured_formatting: {
      main_text: 'Current Location',
      secondary_text: 'current_city',
    },
  }

  const fullData = [currentLocation, ...data]

  const handleSelect = async (description) => {
    setValue(description, false)
    const viewportBounds = await getViewportBounds(
      descriptionToPlaceId.current[description],
    )
    setViewport(viewportBounds)
  }

  return (
    <Combobox
      onSelect={handleSelect}
      aria-label="Search for a location"
      {...props}
    >
      <ComboboxInput
        as={Input}
        value={value}
        onChange={handleInput}
        disabled={!ready}
        icon={<SearchAlt2 />}
        placeholder="Search for a location..."
      />
      <StyledComboboxPopover portal={false}>
        <ComboboxList>
          {status === 'OK' &&
            fullData.map((suggestion) => {
              const {
                place_id,
                description,
                structured_formatting: { main_text, secondary_text },
              } = suggestion

              // Allow handleSelect to access the place id (see above)
              descriptionToPlaceId.current[description] = place_id

              return (
                <ComboboxOption
                  as={SearchEntry}
                  key={place_id}
                  value={description}
                >
                  {[main_text, secondary_text]}
                </ComboboxOption>
              )
            })}
        </ComboboxList>
      </StyledComboboxPopover>
    </Combobox>
  )
}

export default Search
