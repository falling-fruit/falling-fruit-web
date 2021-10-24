import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import GoogleMapReact from 'google-map-react'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import usePlacesAutocomplete from 'use-places-autocomplete'

import { closeFilter, openFilterAndFetch } from '../../redux/filterSlice'
import { searchView } from '../../redux/searchView'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { getPlaceBounds } from '../../utils/viewportBounds'
import FilterIconButton from '../filter/FilterIconButton'
import TrackLocationButton from '../map/TrackLocationButton'
import Input from '../ui/Input'
import SearchEntry from './SearchEntry'

const { googleMapLoader } = GoogleMapReact

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
  const filterOpen = useSelector((state) => state.filter.isOpen)
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

  const handleChange = (e) => {
    if (filterOpen) {
      dispatch(closeFilter())
    }
    setValue(e.target.value)
  }

  const handleSelect = async (description) => {
    setValue(description, false)

    dispatch(
      searchView(
        await getPlaceBounds(descriptionToPlaceId.current[description]),
      ),
    )
  }

  return (
    <Combobox
      onSelect={handleSelect}
      aria-label="Search for a location"
      {...props}
    >
      <SearchBarContainer>
        <ComboboxInput
          as={Input}
          value={value}
          onChange={handleChange}
          disabled={!ready}
          icon={<SearchAlt2 />}
          prepend={isDesktop && <TrackLocationButton isIcon={false} />}
          placeholder="Search for a location..."
        />

        {!isDesktop && (
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
        )}
      </SearchBarContainer>
      <StyledComboboxPopover portal={false}>
        <ComboboxList>
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
      {/* <Filter isOpen={filterOpen} /> */}
    </Combobox>
  )
}

export default Search
