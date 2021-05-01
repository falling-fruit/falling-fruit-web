import TileButton from '../ui/TileButton'
import { MAP_VIEW } from './mapView'

const MapViewList = () =>
  MAP_VIEW.map(({ id, label, onClick, selected }) => (
    <TileButton
      key={id}
      id={id}
      label={label}
      onClick={onClick}
      selected={selected}
    />
  ))

export default MapViewList
