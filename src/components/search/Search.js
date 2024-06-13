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
import GoogleMapReact from 'google-map-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import usePlacesAutocomplete from 'use-places-autocomplete'

import { closeFilter, openFilterAndFetch } from '../../redux/filterSlice'
import { clearSelectedPlace, selectPlace } from '../../redux/mapSlice'
import { bootstrapURLKeys } from '../../utils/bootstrapURLKeys'
import { useIsDesktop } from '../../utils/useBreakpoint'
import { getPlaceBounds, getZoomedInView } from '../../utils/viewportBounds'
import Filter from '../filter/Filter'
import FilterIconButton from '../filter/FilterIconButton'
import TrackLocationButton from '../map/TrackLocationButton'
import Input from '../ui/Input'
import ClearSearchButton from './ClearSearch'
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
  const selectedPlace = useSelector((state) => state.map.place)
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

  useEffect(
    () => {
      // Allow clearing the state from outside
      if (!selectedPlace) {
        setValue('')
      }
    },
    // setValue is a different function object each time
    // and including it in the dependency array would cause an infinite loop
    // but it doesn't actually change
    // (see definition at https://github.com/wellyshen/use-places-autocomplete/blob/master/src/usePlacesAutocomplete.ts)
    [selectedPlace], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const handleChange = (e) => {
    if (filterOpen) {
      dispatch(closeFilter())
    }
    setValue(e.target.value)
  }

  const getCoordinatesResult = () => {
    try {
      const coordinate = new CoordinateParser(value)
      const latlng = `${coordinate.getLatitude()}, ${coordinate.getLongitude()}`

      return (
        <ComboboxOption as={SearchEntry} key={latlng} value={latlng}>
          {[latlng]}
        </ComboboxOption>
      )
    } catch {
      return null
    }
  }

  const handleSelect = async (description) => {
    setValue(description, false)
    if (descriptionToPlaceId.current[description]) {
      dispatch(
        selectPlace(
          await getPlaceBounds(descriptionToPlaceId.current[description]),
        ),
      )
    } else {
      const latitude = Number(description.split(',')[0])
      const longitude = Number(description.split(',')[1])
      dispatch(selectPlace(getZoomedInView(latitude, longitude)))
    }
  }
  const { t } = useTranslation()
  return (
    <Combobox
      onSelect={handleSelect}
      aria-label={t('glossary.address')}
      {...props}
    >
      <SearchBarContainer>
        <ComboboxInput
          as={Input}
          value={value}
          onChange={handleChange}
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

          {status !== 'OK' && getCoordinatesResult()}
        </ComboboxList>
      </StyledComboboxPopover>
      {!isDesktop && <Filter isOpen={filterOpen} />}
    </Combobox>
  )
}

export default Search
