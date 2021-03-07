import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import { useHistory } from 'react-router-dom'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import { useQueryParams } from 'use-query-params'

import Input from '../ui/Input'
import SearchEntry from './SearchEntry'

const Search = () => {
  const [centerCoords, setCenterCoords] = useQueryParams({
    centerLat: 0,
    centerLng: 0,
  })

  let history = useHistory()

  const onSelectHandler = (item) => {
    console.log(item)
    getLongitudeAndLatitudeFromAddress(item)
    console.log(centerCoords.centerLat)
    console.log(centerCoords.centerLng)
    history.push({
      pathname: '/map',
      search: `?centerLat=${centerCoords.centerLat}&centerLng=${centerCoords.centerLng}`,
    })
  }

  const getLongitudeAndLatitudeFromAddress = (placeId) => {
    getGeocode({ placeId })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log(lat)
        console.log(lng)
        setCenterCoords({ ...centerCoords, centerLat: lat, centerLng: lng })
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

  return (
    <Combobox onSelect={onSelectHandler} aria-labelledby="demo">
      <ComboboxInput
        as={Input}
        value={value}
        onChange={handleInput}
        disabled={!ready}
      />
      <ComboboxList>
        {status === 'OK' &&
          data.map(
            ({
              place_id,
              structured_formatting: { main_text, secondary_text },
            }) => (
              <ComboboxOption as={SearchEntry} key={place_id} value={place_id}>
                {[main_text, secondary_text]}
              </ComboboxOption>
            ),
          )}
      </ComboboxList>
    </Combobox>
  )
}

export default Search
