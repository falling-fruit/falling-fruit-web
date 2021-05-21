import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'
import { getTypeCounts } from '../../utils/api'
import { buildTypeSchema, getSelectedTypes } from '../../utils/buildTypeSchema'
import { useFilteredParams } from '../../utils/useFilteredParams'
import { VISIBLE_CLUSTER_ZOOM_LIMIT } from '../map/MapPage'
import CheckboxFilters from './CheckboxFilters'
import TreeSelect from './TreeSelect'

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
  const { view } = useMap()
  const { filters, setFilters, typesById } = useSearch()
  const getFilteredParams = useFilteredParams()

  const [treeData, setTreeData] = useState([])
  const [treeDataLoading, setTreeDataLoading] = useState(false)
  const { settings } = useSettings()
  const { t } = useTranslation()

  const handleTreeChange = (currentNode, selectedNodes) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      types: getSelectedTypes(selectedNodes),
    }))
  }

  useEffect(() => {
    const updateTypesTree = async () => {
      const { zoom, bounds } = view

      if (zoom > VISIBLE_CLUSTER_ZOOM_LIMIT && bounds) {
        setTreeDataLoading(true)

        const counts = await getTypeCounts(
          getFilteredParams({ types: undefined }), // Don't filter by own filtered types when querying for counts
        )

        const countsById = {}
        for (const count of counts) {
          countsById[count.id] = count.count
        }

        setTreeData(
          buildTypeSchema(
            Object.values(typesById),
            countsById,
            filters.types,
            settings.showScientificNames,
          ),
        )

        setTreeDataLoading(false)
      }
    }

    if (isOpen && typesById) {
      updateTypesTree()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, isOpen, filters.muni, setFilters, typesById])

  return (
    isOpen && (
      <StyledFilter>
        <div>
          <p className="edible-type-text">{t('Edible Types')}</p>
          <TreeSelect
            data={treeData}
            shouldZoomIn={view.zoom <= VISIBLE_CLUSTER_ZOOM_LIMIT}
            loading={treeDataLoading}
            onChange={handleTreeChange}
          />
        </div>
        <div>
          <CheckboxFilters values={filters} onChange={setFilters} />
        </div>
      </StyledFilter>
    )
  )
}

export default Filter
