import { memo } from 'react'
import styled from 'styled-components/macro'

import { ScientificName } from '../ui/TypeName'
import { Muted } from './typeStyles'
import { labelParts } from './typeUtils'

const Common = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
`

const Latin = styled(ScientificName)`
  color: ${({ theme }) => theme.text};
`

const Gap = styled.span`
  margin-inline-start: 0.4em;
`

const TypeLabel = ({ type, language, showId = false }) => {
  const { common, botanical, cultivar } = labelParts(type, language)
  const hasScientific = Boolean(botanical || cultivar)
  return (
    <>
      {hasScientific && <Latin botanical={botanical} cultivar={cultivar} />}
      {common && hasScientific && <Gap />}
      {common && <Common>{common}</Common>}
      {showId && (
        <>
          <Gap />
          <Muted>({type.id})</Muted>
        </>
      )}
    </>
  )
}

export default memo(TypeLabel)
