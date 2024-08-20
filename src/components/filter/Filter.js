import { debounce } from 'debounce'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { filtersChanged, selectionChanged } from '../../redux/filterSlice'
import { constructTypesTreeForSelection } from '../../utils/buildTypeSchema'
import Input from '../ui/Input'
import { CheckboxFilters } from './CheckboxFilters'
import FilterButtons from './FilterButtons'
import RCTreeSelectSkeleton from './RCTreeSelectSkeleton'
import TreeSelect from './TreeSelect'

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
  margin: 8px 0;
  /* Provide vertical space when buttons wrap over multiple lines */
  line-height: 1.5rem;
`

const SearchInput = styled(Input)`
  height: 36px;
  padding: 9px 12px;
  input {
    height: 100%;
  }
`

const MuniAndInvasiveCheckboxFilters = styled.div`
  label:not(:last-child) {
    margin-bottom: 8px;
  }
  label:first-child {
    @media ${({ theme }) => theme.device.mobile} {
      margin-top: 15px;
    }
  }
`

const Filter = () => {
  const [searchValue, setSearchValue] = useState('')
  const setSearchValueDebounced = useMemo(
    () => debounce(setSearchValue, 200),
    [setSearchValue],
  )

  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter)
  const {
    isLoading: isLoadingCounts,
    countsById,
    types,
    showOnlyOnMap,
  } = filters
  const { isLoading: isLoadingTypes, typesAccess } = useSelector(
    (state) => state.type,
  )
  const isLoading = isLoadingCounts || isLoadingTypes

  const typesTreeForSelection = useMemo(
    () =>
      constructTypesTreeForSelection(typesAccess, countsById, showOnlyOnMap),
    [typesAccess, countsById, showOnlyOnMap],
  )

  const { t } = useTranslation()
  return (
    <StyledFilter>
      <div>
        <p className="edible-type-text">{t('glossary.types')}</p>
        <SearchInput
          onChange={(e) => setSearchValueDebounced(e.target.value)}
          placeholder={t('type')}
        />
        <TreeFiltersContainer>
          <CheckboxFilters
            values={filters}
            fields={[
              {
                field: 'showOnlyOnMap',
                label: t('only_on_map'),
              },
            ]}
            onChange={(values) => {
              dispatch(filtersChanged(values))
            }}
            style={{ display: 'inline-block', marginRight: '5px' }}
          />
          <FilterButtons
            onSelectAllClick={() =>
              dispatch(
                selectionChanged(
                  typesAccess.localizedTypes.map((type) => type.id),
                ),
              )
            }
            onDeselectAllClick={() => dispatch(selectionChanged([]))}
          />
        </TreeFiltersContainer>
        {typesAccess.localizedTypes.length ? (
          <TreeSelect
            data={typesTreeForSelection}
            loading={isLoading}
            onChange={(selectedTypes) =>
              dispatch(selectionChanged(selectedTypes))
            }
            types={types}
            searchValue={searchValue}
          />
        ) : (
          <RCTreeSelectSkeleton />
        )}
      </div>
      <MuniAndInvasiveCheckboxFilters>
        <CheckboxFilters
          values={filters}
          fields={[
            {
              field: 'muni',
              label: t('glossary.tree_inventory', { count: 2 }),
            },
            {
              field: 'invasive',
              label: t('invasives'),
            },
          ]}
          onChange={(values) => {
            dispatch(filtersChanged(values))
          }}
        />
      </MuniAndInvasiveCheckboxFilters>
    </StyledFilter>
  )
}

export default Filter
