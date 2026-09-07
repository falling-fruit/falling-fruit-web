import styled from 'styled-components/macro'

const ScientificNameRoot = styled.span`
  font-style: italic;
`

const HybridSign = styled.span`
  font-style: normal;
`

const Cultivar = styled.span`
  font-style: normal;
  margin-inline-start: 0.25em;
`

const HYBRID_MARKER = /(^|\s)x(\s|$)/g

const renderBotanicalWithHybridSign = (botanical) => {
  const parts = []
  let lastIndex = 0
  let key = 0
  let match

  HYBRID_MARKER.lastIndex = 0
  while ((match = HYBRID_MARKER.exec(botanical)) !== null) {
    const [, leading, trailing] = match
    const italicText = botanical.slice(lastIndex, match.index) + leading
    if (italicText) {
      parts.push(italicText)
    }
    parts.push(<HybridSign key={`hybrid-${key++}`}>×</HybridSign>)
    if (trailing) {
      parts.push(trailing)
    }
    lastIndex = HYBRID_MARKER.lastIndex
  }

  if (lastIndex < botanical.length) {
    parts.push(botanical.slice(lastIndex))
  }

  return parts
}

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
      {botanical && renderBotanicalWithHybridSign(botanical)}
      {cultivar && <Cultivar>{cultivar}</Cultivar>}
    </ScientificNameRoot>
  )
}

export const CommonName = styled.span`
  font-weight: bold;
`

export const CommonOrScientificName = ({ type, className, style, dir }) => {
  const components = type?.displayComponents()
  if (!components) {
    return null
  }

  const { common, scientific, cultivar } = components

  if (common) {
    return (
      <CommonName className={className} style={style} dir={dir}>
        {common}
      </CommonName>
    )
  }

  return (
    <ScientificName
      className={className}
      style={style}
      dir={dir ?? 'ltr'}
      botanical={scientific}
      cultivar={cultivar}
    />
  )
}

const SecondaryScientificName = styled(ScientificName)`
  margin-inline-start: 0.4em;
`

export const CommonWithScientificName = ({ type, className, style, dir }) => {
  const components = type?.displayComponents()
  if (!components) {
    return null
  }

  const { common, scientific, cultivar } = components

  if (!common) {
    return (
      <ScientificName
        className={className}
        style={style}
        dir={dir ?? 'ltr'}
        botanical={scientific}
        cultivar={cultivar}
      />
    )
  }

  return (
    <span className={className} style={style} dir={dir}>
      <CommonName>{common}</CommonName>
      {(scientific || cultivar) && (
        <SecondaryScientificName
          dir="ltr"
          botanical={scientific}
          cultivar={cultivar}
        />
      )}
    </span>
  )
}
