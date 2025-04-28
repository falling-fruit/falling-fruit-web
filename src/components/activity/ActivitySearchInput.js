import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ClearSearchButton from '../search/ClearSearch'
import Input from '../ui/Input'

const SearchContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 300px;
`

const FilterContainer = styled.div`
  margin-top: 20px;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`

const Tag = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.secondaryBackground};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.transparentBlue : theme.background};
  color: ${({ theme }) => theme.secondaryText};

  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.transparentBlue : theme.secondaryBackground};
  }

  .count {
    margin-inline-start: 6px;
    font-size: 0.8rem;
    background: ${({ theme }) => theme.secondaryBackground};
    border-radius: 10px;
    padding: 2px 6px;
  }
`

const CategoryLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.tertiaryText};
  margin-top: 15px;
  margin-bottom: 5px;
`

const ShowMoreTag = styled(Tag)`
  margin-inline-start: 5px;
`

const getFullCityName = (city) => {
  let fullName = city.city
  if (city.state) {
    fullName += `, ${city.state}`
  }
  if (city.country) {
    fullName += `, ${city.country}`
  }
  return fullName
}

const FilterTags = ({
  typeCountsById,
  cityCounts,
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useTranslation()
  const [visibleTypeCount, setVisibleTypeCount] = useState(5)
  const [visibleCityCount, setVisibleCityCount] = useState(5)

  // TypeCountsById is already an array of TypeCount objects sorted by count
  const sortedTypes = typeCountsById

  // Sort cities by count (largest first)
  const sortedCities = cityCounts.sort((a, b) => b.count - a.count)

  const showMoreTypes = () => {
    setVisibleTypeCount((prev) => prev + 5)
  }

  const showMoreCities = () => {
    setVisibleCityCount((prev) => prev + 5)
  }

  const visibleTypes = sortedTypes.slice(0, visibleTypeCount)
  const hasMoreTypesToShow = visibleTypes.length < sortedTypes.length

  const visibleCities = sortedCities.slice(0, visibleCityCount)
  const hasMoreCitiesToShow = visibleCities.length < sortedCities.length

  return (
    <FilterContainer>
      {visibleTypes.length > 0 && (
        <>
          <CategoryLabel>{t('glossary.type.other')}</CategoryLabel>
          <TagsContainer>
            {visibleTypes.map((typeCount) => (
              <Tag
                key={`type-${typeCount.typeId}`}
                $selected={
                  searchTerm.toLowerCase() ===
                  typeCount.displayName.toLowerCase()
                }
                onClick={() => {
                  if (
                    searchTerm.toLowerCase() ===
                    typeCount.displayName.toLowerCase()
                  ) {
                    onSearchChange('')
                  } else {
                    onSearchChange(typeCount.displayName)
                  }
                }}
              >
                {typeCount.commonName ||
                  (typeCount.scientificName ? (
                    <i>{typeCount.scientificName}</i>
                  ) : (
                    `Type ${typeCount.typeId}`
                  ))}
                <span className="count">{typeCount.count}</span>
              </Tag>
            ))}
            {hasMoreTypesToShow && (
              <ShowMoreTag onClick={showMoreTypes}>...</ShowMoreTag>
            )}
          </TagsContainer>
        </>
      )}

      {visibleCities.length > 0 && (
        <>
          <CategoryLabel>{t('pages.changes.places')}</CategoryLabel>
          <TagsContainer>
            {visibleCities.map((city) => (
              <Tag
                key={`city-${city.city}`}
                $selected={
                  searchTerm.toLowerCase() ===
                  getFullCityName(city).toLowerCase()
                }
                onClick={() => {
                  if (
                    searchTerm.toLowerCase() ===
                    getFullCityName(city).toLowerCase()
                  ) {
                    onSearchChange('')
                  } else {
                    onSearchChange(getFullCityName(city))
                  }
                }}
              >
                {city.city}
                {city.state && `, ${city.state}`}
                {city.country && `, ${city.country}`}
                <span className="count">{city.count}</span>
              </Tag>
            ))}
            {hasMoreCitiesToShow && (
              <ShowMoreTag onClick={showMoreCities}>...</ShowMoreTag>
            )}
          </TagsContainer>
        </>
      )}
    </FilterContainer>
  )
}

const ActivitySearchInput = ({
  value,
  onChange,
  onClear,
  typeCountsById,
  cityCounts,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <SearchContainer>
        <Input
          type="text"
          placeholder={t('form.search')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={t('form.search')}
          icon={
            value === '' ? (
              <SearchAlt2 />
            ) : (
              <ClearSearchButton onClick={onClear} />
            )
          }
        />
      </SearchContainer>
      <FilterTags
        typeCountsById={typeCountsById}
        cityCounts={cityCounts}
        searchTerm={value}
        onSearchChange={onChange}
      />
    </>
  )
}

export default ActivitySearchInput
