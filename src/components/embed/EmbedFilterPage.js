import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { EMBED_HEADER_HEIGHT_PX } from '../../constants/mobileLayout'
import { fetchFilterCounts } from '../../redux/filterSlice'
import Filter from '../filter/Filter'

const FilterPageContainer = styled.div`
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  margin-top: ${EMBED_HEADER_HEIGHT_PX}px;
`

const EmbedFilterPage = () => {
  const { typesAccess } = useSelector((state) => state.type)
  const { lastMapView } = useSelector((state) => state.viewport)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!typesAccess.isEmpty && lastMapView) {
      dispatch(fetchFilterCounts())
    }
  }, [dispatch, typesAccess, lastMapView])

  return (
    <FilterPageContainer>
      <Filter />
    </FilterPageContainer>
  )
}

export default EmbedFilterPage
