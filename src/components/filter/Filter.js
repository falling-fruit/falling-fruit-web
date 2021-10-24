import { debounce } from 'debounce'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { selectionChanged, setFilters } from '../../redux/filterSlice'
import { updateTreeCounts } from '../../utils/buildTypeSchema'
import Input from '../ui/Input'
import { MuniAndInvasiveFilters, ShowOnMapFilter } from './CheckboxFilters'
import FilterButtons from './FilterButtons'
import RCTreeSelect from './RCTreeSelect'

const StyledFilter = styled.div`
  box-sizing: border-box;

  @media ${({ theme }) => theme.device.desktop} {
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
  }

  @media ${({ theme }) => theme.device.mobile} {
    display: flex;
    flex-direction: column-reverse;
  }

  .edible-type-text {
    font-size: 0.875rem;
    font-weight: bold;
    color: ${({ theme }) => theme.secondaryText};
    margin-top: 18px;
    margin-bottom: 7px;
  }
`

const TreeFiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
`

const StyledInput = styled(Input)`
  height: 36px;
  margin-bottom: 7px;
  padding: 9px 12px;
  input {
    height: 100%;
  }
`

const Filter = ({ isOpen }) => {
  const [showOnMap, setShowOnMap] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const setSearchValueDebounced = useMemo(() => debounce(setSearchValue, 200), [
    setSearchValue,
  ])

  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter)
  const showScientificNames = useSelector(
    (state) => state.settings.showScientificNames,
  )
  const { types, isLoading, countsById, treeData, childrenById } = filters

  const treeDataWithUpdatedCounts = useMemo(
    () =>
      updateTreeCounts(
        treeData,
        showScientificNames,
        countsById,
        showOnMap,
        childrenById,
      ),
    [treeData, showScientificNames, countsById, showOnMap, childrenById],
  )

  const onCheckBoxFiltersChange = (values) => dispatch(setFilters(values))

  const onSelectAllClick = () => {
    const treeDataValues = treeData.map((t) =>
      t.value.substring(t.value.indexOf('-') + 1),
    )
    const treeDataNoDuplicates = treeDataValues.filter(
      (value, index) => treeDataValues.indexOf(value) === index,
    )
    dispatch(selectionChanged(treeDataNoDuplicates))
  }

  const onDeselectAllClick = () => {
    dispatch(selectionChanged([]))
  }

  const { t } = useTranslation()
  return isOpen ? (
    <StyledFilter>
      <div>
        <p className="edible-type-text">{t('Edible Types')}</p>
        <StyledInput
          onChange={(e) => setSearchValueDebounced(e.target.value)}
          placeholder="Search for a type..."
        />
        <TreeFiltersContainer>
          <ShowOnMapFilter
            showOnMap={showOnMap}
            onChange={() => setShowOnMap(!showOnMap)}
          />
          <FilterButtons
            onSelectAllClick={onSelectAllClick}
            onDeselectAllClick={onDeselectAllClick}
          />
        </TreeFiltersContainer>
        <RCTreeSelect
          data={treeDataWithUpdatedCounts}
          loading={isLoading}
          onChange={(selectedTypes) =>
            dispatch(
              selectionChanged(
                selectedTypes.filter((t) => !t.includes('root')),
              ),
            )
          }
          checkedTypes={types}
          filters={filters}
          onCheckBoxFiltersChange={onCheckBoxFiltersChange}
          searchValue={searchValue}
        />
      </div>
      <div>
        <MuniAndInvasiveFilters
          values={filters}
          onChange={onCheckBoxFiltersChange}
        />
      </div>
    </StyledFilter>
  ) : null
}

export default Filter
