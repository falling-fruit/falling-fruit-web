import { BackgroundMapPin, MapPin } from './Pins'

const SelectedLocation = ({ selected, editing, ...props }) => (
  <div dir="ltr" {...props}>
    {selected && !editing && <MapPin />}
    {editing && <BackgroundMapPin />}
  </div>
)

export default SelectedLocation
