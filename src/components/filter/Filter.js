import { debounce } from 'debounce'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { setShowOnlyOnMap } from '../../redux/filterSlice'
import { muniChanged, selectionChanged } from '../../redux/viewChange'
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
  margin-top: 1.25em;
  margin-bottom: 0.5em;
  @media ${({ theme }) => theme.device.mobile} {
    margin-top: 0em;
  }
`

const TreeFiltersContainer = styled.div`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  /* Provide vertical space when buttons wrap over multiple lines */
  line-height: 1.5rem;
`

const SearchInput = styled(Input)`
  height: 2.5em;
  padding: 0;
  flex: 0;
  input {
    margin-top: 1em;
    margin-left: 0.75em;
    margin-bottom: 1em;
    margin-right: 0.75em;
    height: 100%;
  }
`
const MuniCheckbox = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
`

const Filter = () => {
  const [searchValue, setSearchValue] = useState('')
  const setSearchValueDebounced = useMemo(
    () => debounce(setSearchValue, 200),
    [setSearchValue],
  )

  const dispatch = useDispatch()
  const { countsById, types, muni, showOnlyOnMap } = useSelector(
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
      ),
    [typesAccess, countsById, showOnlyOnMap, searchValue, types],
  )

  const { t } = useTranslation()
  return (
    <>
      <div>
        <EdibleTypeText>{t('glossary.types')}</EdibleTypeText>
        <SearchInput
          onChange={(e) => setSearchValueDebounced(e.target.value)}
          placeholder={t('filter.type')}
        />
        <TreeFiltersContainer>
          <LabeledCheckbox
            field="showOnlyOnMap"
            value={showOnlyOnMap}
            label={t('filter.only_on_map')}
            onChange={(checked) => dispatch(setShowOnlyOnMap(checked))}
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

      <MuniCheckbox>
        <LabeledCheckbox
          field="muni"
          value={muni}
          label={t('glossary.tree_inventory.one', { count: 2 })}
          onChange={(checked) => dispatch(muniChanged(checked))}
        />
      </MuniCheckbox>
    </>
  )
}

export default Filter
