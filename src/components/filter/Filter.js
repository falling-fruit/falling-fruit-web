import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'

import { selectionChanged, setFilters } from '../../redux/filterSlice'
import { getIsShowingClusters } from '../../redux/viewChange'
import CheckboxFilters from './CheckboxFilters'
import RCTreeSelect from './RCTreeSelect'

const StyledFilter = styled.div`
  box-sizing: border-box;

  @media ${({ theme }) => theme.device.desktop} {
    position: absolute;
    width: 100%;
    // TODO: order z-indexes in enum
    z-index: 99;
    background-color: ${({ theme }) => theme.background};

    box-shadow: 0 3px 5px ${({ theme }) => theme.shadow};
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    padding: 0 10px 16px 10px;
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
  const { treeData, isLoading } = filters

  const { t } = useTranslation()

  return (
    isOpen && (
      <StyledFilter>
        <div>
          <p className="edible-type-text">{t('Edible Types')}</p>
          <RCTreeSelect
            data={treeData}
            shouldZoomIn={isShowingClusters}
            loading={isLoading}
            onChange={(selectedTypes) =>
              dispatch(selectionChanged(selectedTypes))
            }
          />
        </div>
        <div>
          <CheckboxFilters
            values={filters}
            onChange={(values) => dispatch(setFilters(values))}
          />
        </div>
      </StyledFilter>
    )
  )
}

export default Filter
