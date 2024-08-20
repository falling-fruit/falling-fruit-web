import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import CoordinateParser from 'coordinate-parser'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { css } from 'styled-components'
import styled from 'styled-components/macro'
import usePlacesAutocomplete from 'use-places-autocomplete'

import { closeFilter, openFilterAndFetch } from '../../redux/filterSlice'
import { clearSelectedPlace, selectPlace } from '../../redux/placeSlice'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { getPlaceBounds, getZoomedInView } from '../../utils/viewportBounds'
import Filter from '../filter/Filter'
import FilterIconButton from '../filter/FilterIconButton'
import TrackLocationButton from '../map/TrackLocationButton'
import Input from '../ui/Input'
import ClearSearchButton from './ClearSearch'
import SearchEntry from './SearchEntry'

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
const getCoordinatesResult = (value) => {
  try {
    const coordinate = new CoordinateParser(value)
    const latitude = coordinate.getLatitude()
    const longitude = coordinate.getLongitude()
    const latlng = `${latitude}, ${longitude}`

    return {
      place_id: `coordinate-${latlng}`,
      description: latlng,
      structured_formatting: {
        main_text: latlng,
        secondary_text: 'Coordinates',
      },
    }
  } catch {
    return null
  }
}

const Search = (props) => {
  const dispatch = useDispatch()
  const isDesktop = useIsDesktop()
  const filterOpen = useSelector((state) => state.filter.isOpen)
  const selectedPlace = useSelector((state) => state.place.selectedPlace)
  // Reach's Combobox only passes the ComboboxOption's value to handleSelect, so we will
  // keep a map of the value to the place id, which handleSelect also needs
  const descriptionToPlaceId = useRef({})

  // handle component re-render
  // after we sync value from redux, we get suggestions so the menu can open
  // but we want it to open on focus and not on load
  const [hasFocus, setHasFocus] = useState(false)

  const {
    init,
    ready,
    value,
    suggestions: { data },
    setValue,
  } = usePlacesAutocomplete({
    initOnMount: false,
    debounce: 200,
  })

  const { googleMap } = useSelector((state) => state.map)

  const coordinatesResultOrNull = getCoordinatesResult(value)
  const suggestionsList = coordinatesResultOrNull
    ? [coordinatesResultOrNull]
    : hasFocus
      ? data
      : []

  useEffect(() => {
    if (googleMap) {
      init()
    }
  }, [init, googleMap])

  useEffect(
    () => {
      // Allow clearing the state by setting state.map.place to null
      if (!selectedPlace && value) {
        setValue('')
      }
      //Allow restoring the search box after rerender
      if (selectedPlace && !value) {
        setValue(selectedPlace.location.description)
      }
    },
    // The effect should run after first render and each time we clear selectedPlace
    [selectedPlace], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleChange = (e) => {
    if (filterOpen) {
      dispatch(closeFilter())
    }
    setValue(e.target.value)
  }

  const handleSelect = async (description) => {
    setValue(description, false)
    const placeId = descriptionToPlaceId.current[description]
    if (placeId.startsWith('coordinate-')) {
      const latitude = Number(description.split(',')[0])
      const longitude = Number(description.split(',')[1])
      dispatch(
        selectPlace({
          place: getZoomedInView(latitude, longitude),
        }),
      )
    } else {
      const placeBounds = await getPlaceBounds(
        description,
        descriptionToPlaceId.current[description],
      )
      dispatch(selectPlace({ place: placeBounds }))
    }
  }
  const handleFocus = () => {
    setHasFocus(true)
  }

  const { t } = useTranslation()
  return (
    <Combobox
      onSelect={handleSelect}
      aria-label={t('glossary.address')}
      openOnFocus
      {...props}
    >
      <SearchBarContainer>
        <ComboboxInput
          as={Input}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={!ready}
          icon={
            value === '' ? (
              <SearchAlt2 />
            ) : (
              <ClearSearchButton
                onClick={() => {
                  setValue('')
                  dispatch(clearSelectedPlace())
                }}
              />
            )
          }
          prepend={isDesktop && <TrackLocationButton isIcon={false} />}
          placeholder={t('glossary.address')}
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
          {suggestionsList.map((suggestion) => {
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
                isCurrentLocation={
                  description === selectedPlace?.location.description
                }
              >
                {[main_text, secondary_text]}
              </ComboboxOption>
            )
          })}
        </ComboboxList>
      </StyledComboboxPopover>
      {!isDesktop && (
        <FilterWrapper isOpen={filterOpen}>
          <Filter />
        </FilterWrapper>
      )}
    </Combobox>
  )
}

const FilterWrapper = styled.div`
  ${({ isOpen }) =>
    !isOpen &&
    css`
      display: none;
    `}
`

export default Search
