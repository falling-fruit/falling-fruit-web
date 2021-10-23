import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { selectionChanged, setFilters } from '../../redux/filterSlice'
import { useTypesById } from '../../redux/useTypesById'
import { getIsShowingClusters } from '../../redux/viewChange'
import { buildTypeSchema } from '../../utils/buildTypeSchema'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { MuniAndInvasiveFilters, ShowOnMapFilter } from './CheckboxFilters'
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

  Button {
    height: 26px;
    width: 90px;
    padding: 0;
  }
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
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter)
  const isShowingClusters = useSelector(getIsShowingClusters)
  const showScientificNames = useSelector(
    (state) => state.settings.showScientificNames,
  )
  const { types, isLoading, countsById, showOnMap } = filters
  const { typesById } = useTypesById()
  const treeData = buildTypeSchema(
    Object.values(typesById),
    showScientificNames,
    countsById,
    showOnMap,
  )

  const [searchValue, setSearchValue] = useState('')

  const onCheckBoxFiltersChange = (values) => dispatch(setFilters(values))

  const { t } = useTranslation()
  return isOpen ? (
    <StyledFilter>
      <div>
        <p className="edible-type-text">{t('Edible Types')}</p>
        <StyledInput
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for a type..."
        />
        <TreeFiltersContainer>
          <ShowOnMapFilter
            values={filters}
            onChange={onCheckBoxFiltersChange}
          />
          <Button
            onClick={() => {
              const treeDataValues = treeData.map((t) =>
                t.value.substring(t.value.indexOf('-') + 1),
              )
              const treeDataNoDuplicates = treeDataValues.filter(
                (value, index) => treeDataValues.indexOf(value) === index,
              )
              dispatch(selectionChanged(treeDataNoDuplicates))
            }}
          >
            Select All
          </Button>
          <Button
            secondary
            onClick={() => {
              dispatch(selectionChanged([]))
            }}
          >
            Deselect All
          </Button>
        </TreeFiltersContainer>
        <RCTreeSelect
          data={treeData}
          shouldZoomIn={isShowingClusters}
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
