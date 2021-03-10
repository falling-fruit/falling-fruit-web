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
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'
import { NumericObjectParam, useQueryParams } from 'use-query-params'

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
  const [_bounds, setBounds] = useQueryParams({
    ne: NumericObjectParam,
    sw: NumericObjectParam,
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

  const handleSelect = async (description) => {
    setValue(description, false)

    const results = await getGeocode({
      placeId: descriptionToPlaceId.current[description],
    })
    const {
      geometry: { viewport },
    } = results[0]

    const [ne, sw] = [viewport.getNorthEast(), viewport.getSouthWest()]
    setBounds({
      ne: { lat: ne.lat(), lng: ne.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
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
