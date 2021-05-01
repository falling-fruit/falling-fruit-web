/**
 * Map Overlays for Settings Page. Includes the id, label
 * onClick method, and logic for determining whether selected.
 * @constant {Object[]}
 */
const MAP_OVERLAYS = [
  {
    id: 'None',
    label: 'None',
    onClick: `{() => {
            setMapOverlay('None')
          }}`,
    selected: `{mapOverlay === 'None'}`,
  },
  {
    id: 'Biking',
    label: 'Biking',
    onClick: `{() => {
            setMapOverlay('Biking')
          }}`,

    selected: `{mapOverlay === 'Biking'}`,
  },
  {
    id: 'Transit',
    label: 'Transit',
    onClick: `{() => {
            setMapOverlay('Transit')
          }}`,
    selected: `{mapOverlay === 'Transit'}`,
  },
]

export { MAP_OVERLAYS }
