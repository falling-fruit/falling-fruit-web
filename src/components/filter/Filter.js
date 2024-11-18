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

const CategoryCheckboxes = styled.div`
  margin-bottom: 0.25em;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25em;
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
        <CategoryCheckboxes>
          <LabeledCheckbox
            field="forager"
            value={categories.forager}
            label="Forager"
            onChange={(checked) => {
              dispatch(categoryChanged('forager', checked))
            }}
          />
          <LabeledCheckbox
            field="freegan"
            value={categories.freegan}
            label="Freegan"
            onChange={(checked) => {
              dispatch(categoryChanged('freegan', checked))
            }}
          />
          <LabeledCheckbox
            field="grafter"
            value={categories.grafter}
            label="Grafter"
            onChange={(checked) => {
              dispatch(categoryChanged('grafter', checked))
            }}
          />
          <LabeledCheckbox
            field="honeybee"
            value={categories.honeybee}
            label="Honeybee"
            onChange={(checked) => {
              dispatch(categoryChanged('honeybee', checked))
            }}
          />
        </CategoryCheckboxes>
        <LabeledCheckbox
          style={{ marginBottom: '0.5em' }}
          field="noCategory"
          value={categories.noCategory}
          label="Other"
          onChange={(checked) => {
            dispatch(categoryChanged('noCategory', checked))
          }}
        />
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
