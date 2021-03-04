import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  // ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import { useHistory } from 'react-router-dom'
import usePlacesAutocomplete from 'use-places-autocomplete'

import Input from '../ui/Input'

const Search = () => {
  let history = useHistory()

  const onSelectHandler = (item) => {
    history.push({
      pathname: '/map',
      search: `?query=${item}`,
    })
  }

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete()

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  // const handleSelect = (val) => {
  //   setValue(val, false)
  // }
  ;<Input
    placeholder="Search for a location..."
    onChange={handleInput}
    onEnter={(e) => window.alert(`Received:\n${e?.target?.value}`)}
    icon={<SearchAlt2 />}
  />
  return (
    <Combobox onSelect={onSelectHandler} aria-labelledby="demo">
      <ComboboxInput value={value} onChange={handleInput} disabled={!ready} />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}

export default Search
