import styled from 'styled-components/macro'

import TileButton from './TileButton'

const TileRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const RadioTiles = ({ options, value: selectedValue, onChange }) => (
  <TileRow>
    {options.map(({ label, value, imageUrl }) => (
      <TileButton
        key={value}
        $selected={value === selectedValue}
        label={label}
        onClick={() => onChange(value)}
      >
        {imageUrl && <img src={imageUrl} alt={label} />}
      </TileButton>
    ))}
  </TileRow>
)

export default RadioTiles
