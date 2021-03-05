import '@reach/combobox/styles.css'

import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  // ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox'
import Geocode from 'react-geocode'
import { useHistory } from 'react-router-dom'
import usePlacesAutocomplete from 'use-places-autocomplete'

import Input from '../ui/Input'

const Search = () => {
  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
  // const [swlng, setSwlng] = useState(0);
  // const [swlat, setSwlat] = useState(0)
  // const [nelng, setNelng] = useState(0)
  // const [nelat, setNelat] = useState(0)
  let history = useHistory()

  const onSelectHandler = (item) => {
    console.log(item)
    getLongitudeAndLatitudeFromAddress()
    history.push({
      pathname: '/map',
      search: `?query=${item}`,
    })
  }

  const getLongitudeAndLatitudeFromAddress = () => {
    Geocode.fromAddress('Eiffel Tower').then((response) => {
      const { lat, lng } = response.results[0].geometry.location
      console.log(lat, lng)
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
