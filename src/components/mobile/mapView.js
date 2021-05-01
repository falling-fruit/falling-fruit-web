/**
 * Map Views for Settings Page. Includes the id, label
 * onClick method, and logic for determining whether selected.
 * @constant {Object[]}
 */
const MAP_VIEW = [
  {
    id: 'Default',
    label: 'Default',
    onClick: `{() => setMapView('Default')}`,
    selected: `{mapView === 'Default'}`,
  },
  {
    id: 'Satellite',
    label: 'Satellite',
    onClick: `{() => setMapView('Satellite')}`,
    selected: `{mapView === 'Satellite'}`,
  },
  {
    id: 'Terrain',
    label: 'Terrain',
    onClick: `{() => setMapView('Terrain')}`,
    selected: `{mapView === 'Terrain'}`,
  },
]

export { MAP_VIEW }
