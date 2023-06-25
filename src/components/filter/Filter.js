import { debounce } from 'debounce'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { filtersChanged, selectionChanged } from '../../redux/filterSlice'
import { useTypesById } from '../../redux/useTypesById'
import { updateTreeCounts } from '../../utils/buildTypeSchema'
import Input from '../ui/Input'
import { CheckboxFilters } from './CheckboxFilters'
import FilterButtons from './FilterButtons'
import RCTreeSelect from './RCTreeSelect'
import RCTreeSelectSkeleton from './RCTreeSelectSkeleton'

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

const Filter = ({ isOpen }) => {
  const [searchValue, setSearchValue] = useState('')
  const setSearchValueDebounced = useMemo(
    () => debounce(setSearchValue, 200),
    [setSearchValue],
  )

  // force component re-render by calling a dummy state setter
  const forceUpdate = useState()[1].bind(null, {})

  const didMount = useRef(false)

  const dispatch = useDispatch()
  const { typesById } = useTypesById()
  const filters = useSelector((state) => state.filter)
  const {
    types,
    isLoading,
    countsById,
    treeData,
    childrenById,
    showOnlyOnMap,
    scientificNameById,
  } = filters

  const treeDataWithUpdatedCounts = useMemo(
    () =>
      updateTreeCounts(
        treeData,
        countsById,
        showOnlyOnMap,
        childrenById,
        scientificNameById,
      ),
    [treeData, countsById, showOnlyOnMap, childrenById, scientificNameById],
  )

  useLayoutEffect(() => {
    if (didMount.current === false) {
      didMount.current = true

      // Force component to re-render after other calls
      // to correctly render the value of `didMount`
      setTimeout(() => forceUpdate(), 0)
    }

    return () => {
      didMount.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { t } = useTranslation()
  return isOpen ? (
    <StyledFilter>
      <div>
        <p className="edible-type-text">{t('types')}</p>
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
              dispatch(selectionChanged(Object.keys(typesById)))
            }
            onDeselectAllClick={() => dispatch(selectionChanged([]))}
          />
        </TreeFiltersContainer>
        {didMount.current ? (
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
              label: t('inventories'),
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
  ) : null
}

export default Filter
