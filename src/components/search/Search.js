import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { useRef } from 'react'
import styled from 'styled-components'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import { NumberParam, useQueryParams } from 'use-query-params'

import Input from '../ui/Input'
import SearchEntry from './SearchEntry'

// TODO: ask Siraj how highlighting should look
// TODO: for long option descriptions, scroll to beginning of input
const StyledComboboxPopover = styled(ComboboxPopover)`
  border: none;
  background: none;
  padding-top: 8px;
`

const Search = () => {
  const [centerCoords, setCenterCoords] = useQueryParams({
    centerLat: NumberParam,
    centerLng: NumberParam,
  })

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

  const handleSelect = (description) => {
    setValue(description)
    getLongitudeAndLatitudeFromAddress(
      descriptionToPlaceId.current[description],
    )
  }

  const getLongitudeAndLatitudeFromAddress = (placeId) => {
    getGeocode({ placeId })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCenterCoords(
          { ...centerCoords, centerLat: lat, centerLng: lng },
          'push',
        )
      })
  }

  return (
    <Combobox onSelect={handleSelect} aria-labelledby="demo">
      <ComboboxInput
        as={Input}
        value={value}
        onChange={handleInput}
        disabled={!ready}
      />
      <StyledComboboxPopover portal={false}>
        <ComboboxList>
          {status === 'OK' &&
            data.map((suggestion) => {
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
