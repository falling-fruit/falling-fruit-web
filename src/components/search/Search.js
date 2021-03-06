import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  // ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'

import Input from '../ui/Input'

const Search = () => {
  // const [swlat, setSwlat] = useState(0)
  // const [swlng, setSwlng] = useState(0)
  // const [nelat, setNelat] = useState(0)
  // const [nelng, setNelng] = useState(0)
  const [centerLat, setCenterLat] = useState(0)
  const [centerLng, setCenterLng] = useState(0)

  let history = useHistory()

  const onSelectHandler = (item) => {
    console.log(item)
    getLongitudeAndLatitudeFromAddress(item)
    history.push({
      pathname: '/map',
      search: `?centerLat=${centerLat}&centerLng=${centerLng}`,
    })
  }

  const getLongitudeAndLatitudeFromAddress = (description) => {
    getGeocode({ address: description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCenterLat(lat)
        setCenterLng(lng)
      })

    // .then((results) => getLatLng(results[0]))
    // .then(({ lat, lng }) => {
    //   console.log('Coordinates: ', { lat, lng })
    // })
    // .catch((error) => {
    //   console.log('Error: ', error)
    // })
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
