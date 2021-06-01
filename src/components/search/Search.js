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
import GoogleMapReact from 'google-map-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGeolocation } from 'react-use'
import styled from 'styled-components/macro'
import usePlacesAutocomplete from 'use-places-autocomplete'

import { closeFilter, openFilterAndFetch } from '../../redux/filterSlice'
import { zoomIn } from '../../redux/mapSlice'
import { searchView } from '../../redux/searchView'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { getFormattedLocationInfo } from '../../utils/locationInfo'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { getPlaceBounds } from '../../utils/viewportBounds'
import Filter from '../filter/Filter'
import FilterIconButton from '../filter/FilterIconButton'
import Input from '../ui/Input'
import SearchEntry from './SearchEntry'

const { googleMapLoader } = GoogleMapReact

const CurrentLocationButton = styled.button.attrs({
  children: <CurrentLocation size={24} />,
})`
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
  margin-top: 8px;

  @media ${({ theme }) => theme.device.desktop} {
    box-shadow: 0 3px 5px ${({ theme }) => theme.shadow};
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;

    position: absolute;
    width: 100%;
    z-index: 1;
    background-color: ${({ theme }) => theme.background};
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

const Search = (props) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()

  // Geolocation and current city name
  const geolocation = useGeolocation()
  const [cityName, setCityName] = useState(null)

  // Filter visible
  const filterOpen = useSelector((state) => state.filter.isOpen)

  // Open the popover again when the value changes back to empty
  const inputRef = useRef(null)
  // Reach's Combobox only passes the ComboboxOption's value to handleSelect, so we will
  // keep a map of the value to the place id, which handleSelect also needs
  const descriptionToPlaceId = useRef({})

  const {
    init,
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({
    initOnMount: false,
    debounce: 200,
  })

  useEffect(() => {
    googleMapLoader(bootstrapURLKeys).then(init)
  }, [init])

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

    if (ready) {
      fetchCityName()
    }
  }, [geolocation, ready])

  useEffect(() => {
    if (value === '') {
      inputRef.current.blur()
      inputRef.current.focus()
    }
  }, [value])

  const handleChange = (e) => {
    if (filterOpen) {
      dispatch(closeFilter())
    }
    setValue(e.target.value)
  }

  const handleSelect = async (description) => {
    setValue(description, false)

    if (description === 'Current Location') {
      dispatch(
        zoomIn({ lat: geolocation.latitude, lng: geolocation.longitude }),
      )
    } else {
      dispatch(
        searchView(
          await getPlaceBounds(descriptionToPlaceId.current[description]),
        ),
      )
    }
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
              <CurrentLocationButton
                disabled={geolocation.latitude === null}
                onClick={() => handleSelect('Current Location')}
              />
            )
          }
          placeholder="Search for a location..."
        />

        <FilterIconButton
          pressed={filterOpen}
          onClick={() => {
            if (filterOpen) {
              dispatch(closeFilter())
            } else {
              dispatch(openFilterAndFetch())
            }
          }}
        />
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
                value="Current Location"
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

      <Filter isOpen={filterOpen} />
    </Combobox>
  )
}

export default Search
