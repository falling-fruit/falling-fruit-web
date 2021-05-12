import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { useMap } from '../../contexts/MapContext'
import { useSearch } from '../../contexts/SearchContext'
import { useSettings } from '../../contexts/SettingsContext'
import { getTypeCounts } from '../../utils/api'
import { buildTypeSchema, getSelectedTypes } from '../../utils/buildTypeSchema'
import CheckboxFilters from './CheckboxFilters'
import TreeSelect from './TreeSelect'

const StyledFilter = styled.div`
  box-sizing: border-box;

  @media ${({ theme }) => theme.device.desktop} {
    position: absolute;
    width: 100%;
    z-index: 1;
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
    font-size: 14px;
    font-weight: bold;
    color: ${({ theme }) => theme.secondaryText};
    margin-top: 18px;
    margin-bottom: 7px;
  }
`

const Filter = ({ isOpen }) => {
  const { view } = useMap()
  const { filters, setFilters, typesById } = useSearch()
  const [treeData, setTreeData] = useState([])
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
      const { bounds } = view
      console.log(bounds)

      if (bounds) {
        const query = {
          swlng: bounds.sw.lat,
          nelng: bounds.ne.lng,
          swlat: bounds.sw.lat,
          nelat: bounds.ne.lat,
          muni: filters.muni ? '1' : '0',
        }

        const counts = await getTypeCounts(query)

        const countsById = {}
        for (const count of counts) {
          countsById[count.id] = count.count
        }

        console.log(counts)

        setTreeData(
          buildTypeSchema(
            Object.values(typesById),
            countsById,
            filters.types,
            settings.showScientificNames,
          ),
        )
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
          <TreeSelect data={treeData} onChange={handleTreeChange} />
        </div>
        <div>
          <CheckboxFilters values={filters} onChange={setFilters} />
        </div>
      </StyledFilter>
    )
  )
}

export default Filter
