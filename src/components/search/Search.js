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
import usePlacesAutocomplete from 'use-places-autocomplete'

import { getFormattedLocationInfo } from '../../utils/locationInfo'
import { useIsDesktop } from '../../utils/useBreakpoint'
import {
  getGeolocationBounds,
  getPlaceBounds,
} from '../../utils/viewportBounds'
import Input from '../ui/Input'
import SearchContext from './SearchContext'
import SearchEntry from './SearchEntry'

const CurrentLocationButton = (props) => (
  <button {...props}>
    <CurrentLocation size={24} />
  </button>
)

const StyledCurrentLocationButton = styled(CurrentLocationButton)`
  &:enabled {
    cursor: pointer;
  }

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
  @media ${({ theme }) => theme.device.desktop} {
    box-shadow: 0 3px 5px ${({ theme }) => theme.shadow};
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
`

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  @media ${({ theme }) => theme.device.desktop} {
    padding: 10px 10px 0 10px;
  }

  & > div {
    flex: 1;
  }

  & > button {
    margin-left: 10px;
  }
`

const Search = ({ onType, sideButton, ...props }) => {
  const { setViewport } = useContext(SearchContext)
  const isDesktop = useIsDesktop()

  // Geolocation and current city name
  const geolocation = useGeolocation()
  const [cityName, setCityName] = useState(null)
  useEffect(() => {
    async function fetchCityName() {
      if (geolocation.latitude !== null) {
        const city = await getFormattedLocationInfo(
          geolocation.latitude,
          geolocation.longitude,
        )
        setCityName(city)
      }
    }
    fetchCityName()
  }, [geolocation])

  // Open the popover again when the value changes back to empty
  const inputRef = useRef(null)
  // Reach's Combobox only passes the ComboboxOption's value to handleSelect, so we will
  // keep a map of the value to the place id, which handleSelect also needs
  const descriptionToPlaceId = useRef({})

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete()

  useEffect(() => {
    if (value === '') {
      inputRef.current.blur()
      inputRef.current.focus()
    }
  }, [value])

  const handleChange = (e) => {
    onType()
    setValue(e.target.value)
  }

  const handleSelect = async (description) => {
    setValue(description, false)

    let viewportBounds
    if (description === 'Current Location') {
      viewportBounds = getGeolocationBounds(
        geolocation.latitude,
        geolocation.longitude,
      )
    } else {
      viewportBounds = await getPlaceBounds(
        descriptionToPlaceId.current[description],
      )
    }
    setViewport(viewportBounds)
  }

  return (
    <Combobox
      onSelect={handleSelect}
      aria-label="Search for a location"
      openOnFocus={!isDesktop && geolocation.latitude !== null}
      {...props}
    >
      <SearchBarContainer>
        <ComboboxInput
          as={Input}
          value={value}
          onChange={handleChange}
          ref={inputRef}
          disabled={!ready}
          icon={<SearchAlt2 />}
          prepend={
            isDesktop && (
              <StyledCurrentLocationButton
                disabled={geolocation.latitude === null}
                onClick={() => handleSelect('Current Location')}
              />
            )
          }
          placeholder="Search for a location..."
        />
        {sideButton}
      </SearchBarContainer>
      <StyledComboboxPopover portal={false}>
        <ComboboxList>
          {
            /* Render the current location suggestion only if it
              on mobile, the current location is defined, and
              the input is empty */

            !isDesktop && geolocation.latitude !== null && value === '' && (
              <ComboboxOption
                as={SearchEntry}
                value={'Current Location'}
                isCurrentLocation
              >
                {['Current Location', cityName ?? '']}
              </ComboboxOption>
            )
          }

          {status === 'OK' &&
            data.map((suggestion) => {
              const {
                place_id,
                description,
                structured_formatting: { main_text, secondary_text },
              } = suggestion

              // Allow handleSelect to access the place id (see useRef above)
              descriptionToPlaceId.current[description] = place_id

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
