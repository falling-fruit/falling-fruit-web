import styled from 'styled-components/macro'

import TileButton from './TileButton'

const TileRow = styled.div`
  display: flex;
  justify-content: space-between;

  @media ${({ theme }) => theme.device.desktop} {
    // TODO: should buttons be skinny on smaller desktop screen widths
    justify-content: flex-start;

    button {
      margin-right: 10px;
    }
  }
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
