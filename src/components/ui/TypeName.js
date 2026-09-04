import styled from 'styled-components/macro'

const ScientificNameRoot = styled.span`
  font-style: italic;
`

const Cultivar = styled.span`
  font-style: normal;
  margin-inline-start: 0.25em;
`

export const ScientificName = ({
  botanical,
  cultivar,
  className,
  dir,
  style,
}) => {
  if (!botanical && !cultivar) {
    return null
  }
  return (
    <ScientificNameRoot className={className} dir={dir} style={style}>
      {botanical}
      {cultivar && <Cultivar>{cultivar}</Cultivar>}
    </ScientificNameRoot>
  )
}

export const CommonName = styled.span`
  font-weight: bold;
`

export const CommonOrScientificName = ({ type, className, style, dir }) => {
  const label = type?.displayLabel()
  if (!label) {
    return null
  }

  if (label.isScientific) {
    return (
      <ScientificName
        className={className}
        style={style}
        dir={dir ?? 'ltr'}
        botanical={label.botanical}
        cultivar={label.cultivar}
      />
    )
  }

  return (
    <CommonName className={className} style={style} dir={dir}>
      {label.text}
    </CommonName>
  )
}
