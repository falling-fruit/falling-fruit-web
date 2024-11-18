import { debounce } from 'debounce'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import {
  categoryChanged,
  invasiveChanged,
  muniChanged,
  selectionChanged,
} from '../../redux/viewChange'
import buildSelectTree from '../../utils/buildSelectTree'
import Input from '../ui/Input'
import FilterButtons from './FilterButtons'
import LabeledCheckbox from './LabeledCheckbox'
import RCTreeSelectSkeleton from './RCTreeSelectSkeleton'
import TreeSelect from './TreeSelect'

const EdibleTypeText = styled.p`
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
  margin-top: 18px;
  margin-bottom: 7px;
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

const CategorySelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 0.5em;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  option {
    padding: 8px;
  }
`

const Filter = () => {
  const [searchValue, setSearchValue] = useState('')
  const [showOnlyOnMap, setShowOnlyOnMap] = useState(true)
  const setSearchValueDebounced = useMemo(
    () => debounce(setSearchValue, 200),
    [setSearchValue],
  )

  const dispatch = useDispatch()
  const { countsById, types, muni, invasive, categories } = useSelector(
    (state) => state.filter,
  )

  const { typesAccess } = useSelector((state) => state.type)
  const { tree: selectTree, visibleTypeIds } = useMemo(
    () =>
      buildSelectTree(
        typesAccess,
        countsById,
        showOnlyOnMap,
        searchValue,
        types,
        Object.entries(categories)
          .filter(([_, enabled]) => enabled)
          .map(([category]) => category),
      ),
    [typesAccess, countsById, showOnlyOnMap, searchValue, types, categories],
  )

  const { t } = useTranslation()
  return (
    <>
      <div>
        <EdibleTypeText>{t('glossary.types')}</EdibleTypeText>
        <CategorySelect
          multiple
          value={Object.entries(categories)
            .filter(([_, enabled]) => enabled)
            .map(([category]) => category)}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value,
            )
            Object.keys(categories).forEach((category) => {
              dispatch(
                categoryChanged(category, selectedOptions.includes(category)),
              )
            })
          }}
        >
          <option value="forager">Forager</option>
          <option value="freegan">Freegan</option>
          <option value="grafter">Grafter</option>
          <option value="honeybee">Honeybee</option>
          <option value="noCategory">Other</option>
        </CategorySelect>
        <SearchInput
          onChange={(e) => setSearchValueDebounced(e.target.value)}
          placeholder={t('type')}
        />
        <TreeFiltersContainer>
          <LabeledCheckbox
            field="showOnlyOnMap"
            value={showOnlyOnMap}
            label={t('only_on_map')}
            onChange={setShowOnlyOnMap}
            style={{ display: 'inline-block', marginRight: '5px' }}
          />
          <FilterButtons
            onSelectAllClick={() => {
              const newSelection = [...new Set([...types, ...visibleTypeIds])]
              dispatch(selectionChanged(newSelection))
            }}
            onDeselectAllClick={() => {
              const remainingSelection = types.filter(
                (typeId) => !visibleTypeIds.some((t) => t === typeId),
              )
              dispatch(selectionChanged(remainingSelection))
            }}
          />
        </TreeFiltersContainer>
        {typesAccess.isEmpty ? (
          <RCTreeSelectSkeleton />
        ) : (
          <TreeSelect
            types={types}
            onChange={(selectedTypes) =>
              dispatch(selectionChanged(selectedTypes))
            }
            selectTree={selectTree}
          />
        )}
      </div>
      <MuniAndInvasiveCheckboxFilters>
        <LabeledCheckbox
          field="muni"
          value={muni}
          label={t('glossary.tree_inventory', { count: 2 })}
          onChange={(checked) => dispatch(muniChanged(checked))}
        />
        <LabeledCheckbox
          field="invasive"
          value={invasive}
          label={t('invasives')}
          onChange={(checked) => dispatch(invasiveChanged(checked))}
        />
      </MuniAndInvasiveCheckboxFilters>
    </>
  )
}

export default Filter
