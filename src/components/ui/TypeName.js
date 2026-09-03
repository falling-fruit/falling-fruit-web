import { useTranslation } from 'react-i18next'
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

export const SecondaryScientificName = styled(ScientificName)`
  font-weight: normal;
  color: ${({ theme }) => theme.secondaryText};
`

export const CommonAndScientificName = ({
  type,
  className,
  style,
  dir,
  commonNameAs: CommonNameComponent = CommonName,
  scientificNameAs: ScientificNameComponent = SecondaryScientificName,
  commonNameProps,
  scientificNameProps,
}) => {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { commonName, botanical, cultivar } = type ?? {}
  return (
    <span className={className} style={style}>
      {commonName && (
        <CommonNameComponent {...commonNameProps}>
          {commonName}
        </CommonNameComponent>
      )}
      {(botanical || cultivar) && (
        <ScientificNameComponent
          botanical={botanical}
          cultivar={cultivar}
          dir={dir ?? 'ltr'}
          style={{ textAlign: isRTL ? 'right' : 'left' }}
          {...scientificNameProps}
        />
      )}
    </span>
  )
}

const TypeNameWrapper = styled(CommonAndScientificName)`
  ${CommonName} {
    margin-inline-end: 0.25em;
    color: ${({ theme }) => theme.headerText};
  }
`

export const TypeName = ({ type, className, style, dir }) => (
  <TypeNameWrapper type={type} className={className} style={style} dir={dir} />
)

export const CommonOrScientificName = ({ label, className, style, dir }) => {
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
