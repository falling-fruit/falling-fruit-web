import { transparentize } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

import { theme } from '../../ui/GlobalStyle'

const TagList = styled.ul`
  margin: 0px;
  padding: 0;
  list-style: none;
`

const Tag = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 12px;
  height: 23px;
  padding: 0 10px;
  font-size: 0.75rem;
  font-weight: bold;
  background-color: ${({ theme, color, backgroundColor }) =>
    backgroundColor ?? transparentize(0.8, color ?? theme.orange)};
  color: ${({ theme, color }) => color ?? theme.orange};

  &:not(:last-child) {
    margin-right: 6px;
  }
`

export { Tag, TagList }

const EntryTags = ({ locationData }) => {
  const { t } = useTranslation()
  return (
    <TagList>
      {locationData.access != null && (
        <Tag color={theme.tag.access} backgroundColor={theme.transparentOrange}>
          {locationData.access === 0 &&
            t('locations.infowindow.access_short.0')}
          {locationData.access === 1 &&
            t('locations.infowindow.access_short.1')}
          {locationData.access === 2 &&
            t('locations.infowindow.access_short.2')}
          {locationData.access === 3 &&
            t('locations.infowindow.access_short.3')}
          {locationData.access === 4 &&
            t('locations.infowindow.access_short.4')}
        </Tag>
      )}
      {locationData.unverified && (
        <Tag
          color={theme.tag.unverified}
          backgroundColor={theme.transparentPink}
        >
          {t('glossary.unverified')}
        </Tag>
      )}
    </TagList>
  )
}

export default EntryTags
