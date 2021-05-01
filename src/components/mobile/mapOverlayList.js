import TileButton from '../ui/TileButton'
import { MAP_OVERLAYS } from './mapOverlays'

const MapOverlayList = () =>
  MAP_OVERLAYS.map(({ id, label, onClick, selected }) => (
    <TileButton
      key={id}
      id={id}
      label={label}
      onClick={onClick}
      selected={selected}
    />
  ))

export default MapOverlayList
