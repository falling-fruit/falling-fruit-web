import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { selectionChanged, setFilters } from '../../redux/filterSlice'
import { useTypesById } from '../../redux/useTypesById'
import { getIsShowingClusters } from '../../redux/viewChange'
import { buildTypeSchema } from '../../utils/buildTypeSchema'
import CheckboxFilters from './CheckboxFilters'
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
    padding: 0 10px 16px 10px;
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

const Filter = ({ isOpen }) => {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter)
  const isShowingClusters = useSelector(getIsShowingClusters)
  const showScientificNames = useSelector(
    (state) => state.settings.showScientificNames,
  )
  const { isLoading } = filters
  const { typesById } = useTypesById()
  const treeData = buildTypeSchema(
    Object.values(typesById),
    showScientificNames,
  )

  const [checkedTypes, setCheckedTypes] = useState([])

  const { t } = useTranslation()
  return isOpen ? (
    <StyledFilter>
      <div>
        <p className="edible-type-text">{t('Edible Types')}</p>
        <RCTreeSelect
          data={treeData}
          shouldZoomIn={isShowingClusters}
          loading={isLoading}
          onChange={(selectedTypes) => {
            setCheckedTypes(selectedTypes)
            dispatch(selectionChanged(selectedTypes.map((t) => t.value)))
          }}
          checkedTypes={checkedTypes}
        />
      </div>
      <div>
        <CheckboxFilters
          values={filters}
          onChange={(values) => dispatch(setFilters(values))}
        />
      </div>
    </StyledFilter>
  ) : null
}

export default Filter
