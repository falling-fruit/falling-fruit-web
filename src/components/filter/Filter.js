import { debounce } from 'debounce'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { selectionChanged, setFilters } from '../../redux/filterSlice'
import { fetchLocations } from '../../redux/viewChange'
import { updateTreeCounts } from '../../utils/buildTypeSchema'
import Input from '../ui/Input'
import {
  CheckboxFilters,
  MUNI_AND_INVASIVE_CHECKBOX_FIELDS,
  TREE_SHOW_CHECKBOX_FIELDS,
} from './CheckboxFilters'
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
  margin: 10px 0;
`

const StyledInput = styled(Input)`
  height: 36px;
  padding: 9px 12px;
  input {
    height: 100%;
  }
`

const MuniAndInvasiveCheckboxFilters = styled.div`
  label:not(:last-child) {
    margin-bottom: 8px;
    @media ${({ theme }) => theme.device.mobile} {
      margin-top: 15px;
    }
  }
`

const Filter = ({ isOpen }) => {
  const [searchValue, setSearchValue] = useState('')
  const setSearchValueDebounced = useMemo(() => debounce(setSearchValue, 200), [
    setSearchValue,
  ])

  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter)
  const showScientificNames = useSelector(
    (state) => state.settings.showScientificNames,
  )
  const {
    types,
    isLoading,
    countsById,
    treeData,
    childrenById,
    showOnlyOnMap,
  } = filters

  const treeDataWithUpdatedCounts = useMemo(
    () =>
      updateTreeCounts(
        treeData,
        showScientificNames,
        countsById,
        showOnlyOnMap,
        childrenById,
      ),
    [treeData, showScientificNames, countsById, showOnlyOnMap, childrenById],
  )

  const onMuniInvasiveCheckBoxFiltersChange = (values) => {
    dispatch(setFilters(values))
    dispatch(fetchLocations())
  }

  const onTreeShowCheckBoxFiltersChange = (values) => {
    dispatch(setFilters(values))
  }

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
          <CheckboxFilters
            values={filters}
            fields={TREE_SHOW_CHECKBOX_FIELDS}
            onChange={onTreeShowCheckBoxFiltersChange}
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
          searchValue={searchValue}
        />
      </div>
      <MuniAndInvasiveCheckboxFilters>
        <CheckboxFilters
          values={filters}
          fields={MUNI_AND_INVASIVE_CHECKBOX_FIELDS}
          onChange={onMuniInvasiveCheckBoxFiltersChange}
        />
      </MuniAndInvasiveCheckboxFilters>
    </StyledFilter>
  ) : null
}

export default Filter
