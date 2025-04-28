import styled from 'styled-components/macro'

import TileButton from './TileButton'

const TileRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  /* HACK: Override > *:not(:last-child) in SettingsPage */
  margin-block-end: 10px !important;
`

const RadioTiles = ({ options, value: selectedValue, onChange }) => (
  <TileRow>
    {options.map(({ label, value, image }) => (
      <TileButton
        key={value}
        $selected={value === selectedValue}
        label={label}
        onClick={() => onChange(value)}
      >
        {image && <img src={image} alt={label} />}
      </TileButton>
    ))}
  </TileRow>
)

export default RadioTiles
