import { debounce } from 'debounce'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { setShowOnlyOnMap } from '../../redux/filterSlice'
import { muniChanged, selectionChanged } from '../../redux/viewChange'
import buildSelectTree from '../../utils/buildSelectTree'
import { useIsDesktop } from '../../utils/useBreakpoint'
import Input from '../ui/Input'
import { Select } from '../ui/Select'
import FilterButtons from './FilterButtons'
import LabeledCheckbox from './LabeledCheckbox'
import RCTreeSelectSkeleton from './RCTreeSelectSkeleton'
import TreeSelect from './TreeSelect'

const EdibleTypeText = styled.p`
  font-size: 0.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.secondaryText};
  margin-block: 0.75em;
  margin-block-end: 0.5em;
`

const SearchAndSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`

const SearchInput = styled(Input)`
  flex: 1;
  min-width: 5em;
  height: 2.65em;
  input {
    margin-block: 0.5em;
  }
`

const MapAreaSelectWrapper = styled.div`
  width: 15em;
`

const MunicipalTreeInventoriesCheckbox = styled.div`
  margin-block-start: 1em;
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

  const isDesktop = useIsDesktop()
  const { t } = useTranslation()
  const mapAreaOptions = [
    { value: 'map', label: t('filter.within_map_bounds') },
    { value: 'all', label: t('filter.all_types') },
  ]
  return (
    <div style={{ marginBlockEnd: '0.5em' }}>
      <MunicipalTreeInventoriesCheckbox>
        <LabeledCheckbox
          field="muni"
          value={muni}
          label={t('filter.include_locations_from_tree_inventories')}
          onChange={(checked) => dispatch(muniChanged(checked))}
        />
      </MunicipalTreeInventoriesCheckbox>
      <EdibleTypeText isDesktop={isDesktop}>
        {t('glossary.type.other')}
      </EdibleTypeText>
      <SearchAndSelectContainer>
        <MapAreaSelectWrapper>
          <Select
            value={mapAreaOptions.find(
              (option) => option.value === (showOnlyOnMap ? 'map' : 'all'),
            )}
            onChange={(selectedOption) =>
              dispatch(setShowOnlyOnMap(selectedOption.value === 'map'))
            }
            options={mapAreaOptions}
          />
        </MapAreaSelectWrapper>
        <SearchInput
          onChange={(e) => setSearchValueDebounced(e.target.value)}
          placeholder={t('glossary.type.one')}
        />
      </SearchAndSelectContainer>
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
        isSelectAllDisabled={visibleTypeIds.every((typeId) =>
          types.includes(typeId),
        )}
        isDeselectAllDisabled={visibleTypeIds.every(
          (typeId) => !types.includes(typeId),
        )}
      />
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
  )
}

export default Filter
