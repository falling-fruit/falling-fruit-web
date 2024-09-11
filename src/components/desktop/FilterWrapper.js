import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { fetchFilterCounts } from '../../redux/filterSlice'
import Filter from '../filter/Filter'

const StyledFilter = styled.div`
  box-sizing: border-box;

  width: 100%;
  > *:nth-child(1) {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  background-color: ${({ theme }) => theme.background};
  padding: 0 10px 8px 10px;
  margin-top: 3px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const FilterWrapper = () => {
  const { typesAccess } = useSelector((state) => state.type)
  const { lastMapView } = useSelector((state) => state.viewport)
  const dispatch = useDispatch()

  const countsAvailable = !(typesAccess.isEmpty || lastMapView === null)

  useEffect(() => {
    if (countsAvailable) {
      dispatch(fetchFilterCounts())
    }
  }, [dispatch, countsAvailable])

  return (
    <StyledFilter>
      <Filter />
    </StyledFilter>
  )
}

export default FilterWrapper
