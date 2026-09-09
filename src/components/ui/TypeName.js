import styled from 'styled-components/macro'

import { tokenizeBotanicalName } from '../../utils/botanicalName'

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

const renderBotanicalWithHybridSign = (botanical) =>
  tokenizeBotanicalName(botanical).map((segment, index) =>
    segment.type === 'hybridSign' ? (
      <HybridSign key={`hybrid-${index}`}>×</HybridSign>
    ) : (
      segment.value
    ),
  )

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
