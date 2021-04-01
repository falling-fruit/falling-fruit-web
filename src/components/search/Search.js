import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import { CurrentLocation } from '@styled-icons/boxicons-regular/CurrentLocation'
import { useContext, useEffect, useRef, useState } from 'react'
import { useGeolocation } from 'react-use'
import styled from 'styled-components/macro'
// TODO: Switch to https://www.npmjs.com/package/@googlemaps/js-api-loader
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'

import extractCityName from '../../utils/extractCityName'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Input from '../ui/Input'
import SearchContext from './SearchContext'
import SearchEntry from './SearchEntry'

const BOUND = 0.001

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
const CurrentLocationButton = (props) => (
  <button {...props}>
    <CurrentLocation size={24} />
  </button>
)
const StyledCurrentLocationButton = styled(CurrentLocationButton)`
  background: none;
  color: inherit;
  border: none;
  height: 100%;
  border-radius: 50% 0 0 50%;
  border-right: 1px solid #e0e1e2;

  svg {
    color: ${({ theme }) => theme.blue};
  }

  &:disabled svg {
    color: ${({ theme }) => theme.tertiaryText};
  }
`

// TODO: ask Siraj how highlighting should look
// TODO: for long option descriptions, scroll to beginning of input
const StyledComboboxPopover = styled(ComboboxPopover)`
  border: none;
  background: none;
  padding-top: 8px;
`

const Search = (props) => {
  const { setViewport } = useContext(SearchContext)
  const isDesktop = useIsDesktop()
  const geoLocation = useGeolocation()
  const [cityName, setCityName] = useState(undefined)

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

  useEffect(() => {
    async function getCityName() {
      const city = await extractCityName({
        lat: geoLocation.latitude,
        lng: geoLocation.longitude,
      })
      setCityName(city)
    }
    getCityName()
    // TODO: Need to debounce this so that the server doesn't get killed
    // See: https://usehooks.com/useDebounce/
  }, [geoLocation])

  let currentLocationEntry = {
    place_id: null,
    description: 'Current Location',
    structured_formatting: {
      main_text: 'Current Location',
      secondary_text: `${cityName ? cityName : ''}`,
    },
  }

  const handleSelect = async (description) => {
    if (description === 'Current Location') {
      // Use fixed viewport around the lat and long of the current location
      const lat = geoLocation.latitude
      const lng = geoLocation.longitude

      const viewportBounds = {
        ne: { lat: lat + BOUND, lng: lng + BOUND },
        sw: { lat: lat - BOUND, lng: lng - BOUND },
      }
      setViewport(viewportBounds)
    }
    setValue(description, false)
    const viewportBounds = await getViewportBounds(
      descriptionToPlaceId.current[description],
    )
    setViewport(viewportBounds)
  }

  const inputRef = useRef(null)

  useEffect(() => {
    if (value === '') {
      inputRef.current.blur()
      inputRef.current.focus()
    }
  }, [value])

  return (
    <Combobox
      onSelect={handleSelect}
      aria-label="Search for a location"
      openOnFocus={!isDesktop && cityName !== undefined}
      {...props}
    >
      {console.log(cityName)}
      <ComboboxInput
        as={Input}
        value={value}
        onChange={handleInput}
        ref={inputRef}
        disabled={!ready}
        icon={<SearchAlt2 />}
        prepend={
          isDesktop && (
            <StyledCurrentLocationButton
              disabled={cityName === undefined}
              onClick={() => handleSelect('Current Location')}
            />
          )
        }
        placeholder="Search for a location..."
      />
      <StyledComboboxPopover portal={false}>
        <ComboboxList>
          {/**
              Render the current location suggestion only if it
              on mobile, the current location is defined, and
              the input is empty
             */}
          {!isDesktop && cityName !== undefined && value === '' && (
            <ComboboxOption
              as={SearchEntry}
              key={1}
              value={currentLocationEntry.description}
              isCurrent={currentLocationEntry.place_id === null}
            >
              {[
                currentLocationEntry.structured_formatting.main_text,
                currentLocationEntry.structured_formatting.secondary_text,
              ]}
            </ComboboxOption>
          )}
          {status === 'OK' &&
            data.map((suggestion) => {
              const {
                place_id,
                description,
                structured_formatting: { main_text, secondary_text },
              } = suggestion

              // Allow handleSelect to access the place id (see above)
              if (place_id) {
                descriptionToPlaceId.current[description] = place_id
              }

              return (
                <ComboboxOption
                  as={SearchEntry}
                  key={place_id}
                  value={description}
                  isCurrent={place_id === null}
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
