import { BackgroundMapPin, MapPin } from './Pins'

const SelectedLocation = ({ selected, editing }) => (
  <div dir="ltr">
    {selected && !editing && <MapPin />}
    {editing && <BackgroundMapPin />}
  </div>
)

export default SelectedLocation
