import { MapAlt as Map } from '@styled-icons/boxicons-regular'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { tokenizeQuery } from '../../utils/tokenize'
import { Select } from '../ui/Select'
import {
  CountBadge,
  DetailsBlock,
  ItemWrapper,
  PrimaryName,
  SecondaryDetails,
  TypeName,
} from '../ui/TypeName'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
`

const CategoryLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.tertiaryText};
  margin-bottom: 5px;
`

// Custom component to display city with count
const PlaceOption = ({ place, count }) => {
  if (place.isCoordinates) {
    return (
      <ItemWrapper>
        <DetailsBlock>
          <PrimaryName>
            <Map
              style={{ verticalAlign: 'sub', marginRight: '0.1em' }}
              size="1em"
            />
            {place.coordinatesGrid}
          </PrimaryName>
        </DetailsBlock>
        {count !== undefined && <CountBadge>{count}</CountBadge>}
      </ItemWrapper>
    )
  }

  const locationDetails = [place.state, place.country]
    .filter(Boolean)
    .join(', ')

  return (
    <ItemWrapper>
      <DetailsBlock>
        <PrimaryName>{place.city}</PrimaryName>
        {locationDetails && (
          <SecondaryDetails>{locationDetails}</SecondaryDetails>
        )}
      </DetailsBlock>
      {count !== undefined && <CountBadge>{count}</CountBadge>}
    </ItemWrapper>
  )
}

// Filter function for select options using tokenized search
const filterOption = (candidate, input) => {
  if (!input) {
    return true
  }

  const tokenizedInput = tokenizeQuery(input)
  const searchReference = candidate.data.searchReference

  return searchReference && searchReference.includes(tokenizedInput)
}

const TypesAndPlaces = ({
  typeCounts,
  cityCounts,
  selectedTypes,
  selectedPlaces,
  onTypeChange,
  onPlaceChange,
  isDisabled = false,
}) => {
  const { t } = useTranslation()

  return (
    <Container>
      <div>
        <CategoryLabel>{t('glossary.type.other')}</CategoryLabel>
        <Select
          options={typeCounts}
          value={
            selectedTypes
              ?.map((typeId) =>
                typeCounts.find((option) => option.value === typeId),
              )
              .filter(Boolean) || []
          }
          onChange={(options) =>
            onTypeChange(options?.map((option) => option.value) || [])
          }
          placeholder={t('glossary.type.one')}
          isClearable
          isMulti
          isDisabled={isDisabled}
          formatOptionLabel={(option, { context }) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <TypeName
                commonName={option.commonName}
                scientificName={option.scientificName}
                count={
                  context === 'menu'
                    ? option.filteredCount !== undefined &&
                      option.filteredCount !== option.count
                      ? `${option.filteredCount}/${option.count}`
                      : option.count
                    : undefined
                }
              />
            </div>
          )}
          filterOption={filterOption}
        />
      </div>

      <div>
        <CategoryLabel>{t('pages.changes.place.other')}</CategoryLabel>
        <Select
          options={cityCounts}
          value={
            selectedPlaces
              ?.map((place) =>
                cityCounts.find((option) => option.value === place),
              )
              .filter(Boolean) || []
          }
          onChange={(options) =>
            onPlaceChange(options?.map((option) => option.value) || [])
          }
          placeholder={t('pages.changes.place.one')}
          isClearable
          isMulti
          isDisabled={isDisabled}
          formatOptionLabel={(option, { context }) => (
            <PlaceOption
              place={option}
              count={
                context === 'menu'
                  ? option.filteredCount !== undefined &&
                    option.filteredCount !== option.count
                    ? `${option.filteredCount}/${option.count}`
                    : option.count
                  : undefined
              }
            />
          )}
          filterOption={filterOption}
        />
      </div>
    </Container>
  )
}

export default TypesAndPlaces
